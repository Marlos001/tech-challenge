import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage, ToolMessage } from '@langchain/core/messages';
import carsData from '@/data/cars.json';
import type { Car } from '@/types/car';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    const cars = carsData as Car[];
    const apiKey = process.env.OPENAI_API_KEY;
    const hasApiKey = typeof apiKey === 'string' && apiKey.length > 0;

    const normalize = (s?: string) => (s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const normMsg = normalize(message);
    const recentHistory: Array<{ role: 'user' | 'assistant'; content: string }> = Array.isArray(history) ? history.slice(-12) : [];
    const historyText = normalize(recentHistory.map((h) => h.content).join(' \n '));
    const combinedText = `${historyText} \n ${normMsg}`;
    const askAll = /(todos|todas|all)\s+(os\s+)?carros/.test(normMsg) || /(carros).*(brasil|pa[ií]s|estado|estados)/.test(normMsg);

    const cityToUf: Record<string, string> = {
      'sao paulo': 'sp',
      'campinas': 'sp',
      'rio de janeiro': 'rj',
      'belo horizonte': 'mg',
      'curitiba': 'pr',
      'porto alegre': 'rs',
    };

    const stateToUf: Record<string, string> = {
      'sao paulo': 'sp',
      'rio de janeiro': 'rj',
      'minas gerais': 'mg',
      'parana': 'pr',
      'rio grande do sul': 'rs',
    };

    const cleanLocationPhrase = (text?: string) =>
      normalize(text)
        .replace(/\b(estado|cidade|de|do|da|em|no|na|dos|das)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const makeLocationTokens = (city: string) => {
      const normCity = normalize(city);
      const uf = cityToUf[normCity];
      const initials = normCity
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('');
      return [normCity, uf, initials].filter(Boolean) as string[];
    };

    // Simple fuzzy matching helpers for brand/model extraction
    const levenshtein = (a: string, b: string) => {
      const m = a.length; const n = b.length;
      const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + cost
          );
        }
      }
      return dp[m][n];
    };
    const fuzzyIncludes = (hay: string, needle: string) => {
      if (!hay || !needle) return false;
      if (hay.includes(needle)) return true;
      // allow small typos: check distance to any substring of same length within threshold 1-2
      const len = needle.length;
      if (len < 4) return false;
      for (let i = 0; i <= hay.length - len; i++) {
        const sub = hay.slice(i, i + len);
        if (levenshtein(sub, needle) <= 2) return true;
      }
      return false;
    };

    const searchCarsFunc = async (input: any) => {
      const name = normalize(input?.name);
      const model = normalize(input?.model);
      const location = cleanLocationPhrase(input?.location);
      const powertrain = normalize(input?.powertrain);
      const body = normalize(input?.body);
      const minSeats = typeof input?.minSeats === 'number' ? input.minSeats : undefined;
      const tags: string[] = Array.isArray(input?.tags) ? (input.tags as string[]).map((t) => normalize(String(t))) : [];
      const requestedUF = (() => {
        if (!location) return undefined;
        if (/^[a-z]{2}$/i.test(location)) return location as string; // uf like 'sp'
        if (stateToUf[location]) return stateToUf[location];
        if (cityToUf[location]) return cityToUf[location];
        return undefined;
      })();
      const minPrice = typeof input?.minPrice === 'number' ? input.minPrice : 0;
      const maxPrice = typeof input?.maxPrice === 'number' ? input.maxPrice : Number.MAX_SAFE_INTEGER;
      const datasetSize = Array.isArray(cars) ? cars.length : 0;
      const limit = typeof input?.limit === 'number'
        ? Math.max(1, Math.min(datasetSize || 12, input.limit))
        : (datasetSize || 12);

      const filtered = (cars || []).filter((car) => {
        const n = normalize(car.Name);
        const m = normalize(car.Model);
        const l = normalize(car.Location);
        const locationTokens = makeLocationTokens(car.Location);
        const matchName = !name || n.includes(name);
        const matchModel = !model || m.includes(model);
        const carUF = cityToUf[normalize(car.Location)];
        const matchLocation = !location
          ? true
          : requestedUF
            ? carUF === requestedUF
            : (
              l.includes(location) ||
              location.includes(l) ||
              locationTokens.some((tok) => tok && (tok === location || tok.includes(location) || location.includes(tok)))
            );
        const matchPrice = car.Price >= minPrice && car.Price <= maxPrice;
        const matchPowertrain = !powertrain || (car.Powertrain && normalize(car.Powertrain) === powertrain);
        const matchBody = !body || (car.Body && normalize(car.Body) === body);
        const matchSeats = !minSeats || (typeof car.Seats === 'number' && car.Seats >= minSeats);
        const carTags: string[] = Array.isArray(car.Tags) ? car.Tags.map((t) => normalize(String(t))) : [];
        const matchTags = tags.length === 0 || tags.every((t) => carTags.includes(t));
        return matchName && matchModel && matchLocation && matchPrice && matchPowertrain && matchBody && matchSeats && matchTags;
      });

      const results = filtered.slice(0, limit);
      return JSON.stringify({ count: results.length, results });
    };

    // Recommendation with scoring based on profile and constraints
    const recommendCarsFunc = async (input: any) => {
      const budget: number | undefined = typeof input?.budget === 'number' ? input.budget : undefined;
      const location = cleanLocationPhrase(input?.location);
      const requestedUF = (() => {
        if (!location) return undefined;
        if (/^[a-z]{2}$/i.test(location)) return location as string;
        if (stateToUf[location]) return stateToUf[location];
        if (cityToUf[location]) return cityToUf[location];
        return undefined;
      })();
      const usage: string = normalize(input?.usage); // city | highway | mixed
      const familySize: number | undefined = typeof input?.familySize === 'number' ? input.familySize : undefined;
      const preferSUV: boolean = Boolean(input?.preferSUV);
      const preferEV: boolean = Boolean(input?.preferEV);
      const wantsTech: boolean = Boolean(input?.wantsTech);
      const needsCargo: boolean = Boolean(input?.needsCargo);
      const limit = typeof input?.limit === 'number' ? Math.max(1, Math.min(cars.length || 12, input.limit)) : 6;

      type Scored = { car: Car; score: number; reasons: string[] };
      const scored: Scored[] = (cars || []).map((car) => {
        let score = 0;
        const reasons: string[] = [];
        // Budget
        if (typeof budget === 'number') {
          if (car.Price <= budget) {
            score += 30;
            reasons.push('Dentro do orçamento');
            // Closer to budget gets slightly higher score
            const ratio = car.Price / (budget || 1);
            score += Math.max(0, 10 - Math.abs(0.85 - ratio) * 40);
          } else {
            score -= 10;
          }
        }
        // Location proximity
        if (requestedUF) {
          const carUF = cityToUf[normalize(car.Location)];
          if (carUF === requestedUF) {
            score += 15; reasons.push('Disponível na sua região');
          }
        }
        // Usage preferences
        const tags = Array.isArray(car.Tags) ? car.Tags.map((t) => normalize(String(t))) : [];
        if (usage === 'city' && tags.includes('city')) { score += 10; reasons.push('Bom para uso urbano'); }
        if (usage === 'highway' && (tags.includes('travel') || tags.includes('comfort'))) { score += 10; reasons.push('Confortável para estrada'); }
        if (usage === 'mixed' && (tags.includes('city') || tags.includes('travel'))) { score += 8; reasons.push('Versátil para cidade e estrada'); }
        // Family size vs seats
        if (typeof familySize === 'number' && typeof car.Seats === 'number' && car.Seats >= familySize) {
          score += 8; reasons.push('Espaço para família');
        }
        // Body preference
        if (preferSUV && car.Body === 'suv') { score += 8; reasons.push('Altura e versatilidade de SUV'); }
        // EV preference / tech
        if (preferEV && car.Powertrain === 'electric') { score += 12; reasons.push('Elétrico (zero emissões)'); }
        if (wantsTech && tags.includes('tech')) { score += 6; reasons.push('Pacote tecnológico'); }
        // Cargo needs (approx by body/tag)
        if (needsCargo && (car.Body === 'suv' || tags.includes('travel') || tags.includes('family'))) { score += 6; reasons.push('Bom porta-malas'); }
        return { car, score, reasons };
      });

      const filtered = scored
        .filter((s) => (typeof budget !== 'number' || s.car.Price <= budget + 5000))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return JSON.stringify({ count: filtered.length, results: filtered.map((s) => s.car) });
    };

    // Extract constraints from history + current message
    const extractMaxBudget = (text: string): number | undefined => {
      // Normalize for robust money parsing
      const t = text.toLowerCase();
      // 1) Explicit thousands shorthand: 80k, 120k
      const kMatch = t.match(/(\d{1,3})\s*k\b/);
      if (kMatch) {
        const base = parseInt(kMatch[1], 10);
        if (!Number.isNaN(base)) return base * 1000;
      }
      // 2) Portuguese thousands: 80 mil, 80mil, 80 mil reais
      const milMatch = t.match(/(\d{1,3})\s*mil(\s+reais)?\b/);
      if (milMatch) {
        const base = parseInt(milMatch[1], 10);
        if (!Number.isNaN(base)) return base * 1000;
      }
      // 3) Millions: 1 milhão, 2 milhoes, 1 mi
      const miMatch = t.match(/(\d{1,2})\s*(milh(?:a|ã)o(?:es)?|milhoes|milhão|mi)\b/);
      if (miMatch) {
        const base = parseInt(miMatch[1], 10);
        if (!Number.isNaN(base)) return base * 1_000_000;
      }
      // 4) Formatted currency: R$ 100.000, 100.000, 100000
      const money = t.match(/(?:r\$\s*)?(\d{1,3}(?:[\.,]\d{3})+|\d{2,7})/i);
      if (money) {
        const raw = money[1].replace(/[\.,]/g, '');
        const val = parseInt(raw, 10);
        if (!Number.isNaN(val)) return val;
      }
      return undefined;
    };

    const inferredLocation = (() => {
      // Try to detect UF/state in combined text
      for (const [stateName, uf] of Object.entries(stateToUf)) {
        if (combinedText.includes(stateName)) return uf;
      }
      // cities map
      for (const [cityName, uf] of Object.entries(cityToUf)) {
        if (combinedText.includes(cityName)) return uf;
      }
      // explicit UF tokens
      const ufToken = combinedText.match(/\b(sp|rj|mg|pr|rs)\b/);
      return ufToken ? ufToken[1] : undefined;
    })();

    const inferredMax = extractMaxBudget(combinedText);

    // Details intent detection ("show me more" about a specific car)
    const detailsIntent = /(detalh|mostrar|mostre|ver\s+mais|mais\s+do|quero\s+ver|fotos|interior|traseira|porta[-\s]?malas)/.test(normMsg);
    const uniqueBrands = Array.from(new Set(cars.map((c) => normalize(c.Name))));
    const uniqueModels = Array.from(new Set(cars.map((c) => normalize(c.Model))));

    if (detailsIntent) {
      // Try to resolve brand and model from current message or history
      const brandFromMsg = uniqueBrands.find((b) => b && (normMsg.includes(b) || fuzzyIncludes(normMsg, b)));
      const modelFromMsg = uniqueModels.find((m) => m && (normMsg.includes(m) || fuzzyIncludes(normMsg, m)));
      const brandFromHist = uniqueBrands.find((b) => b && (historyText.includes(b) || fuzzyIncludes(historyText, b)));
      const modelFromHist = uniqueModels.find((m) => m && (historyText.includes(m) || fuzzyIncludes(historyText, m)));

      const brand = brandFromMsg || brandFromHist;
      const model = modelFromMsg || modelFromHist;

      let target: Car | undefined;
      if (brand && model) target = (cars || []).find((c) => normalize(c.Name) === brand && normalize(c.Model) === model);
      else if (brand) target = (cars || []).filter((c) => normalize(c.Name) === brand).sort((a, b) => a.Price - b.Price)[0];
      else if (model) target = (cars || []).find((c) => normalize(c.Model) === model);

      if (target) {
        const userUF = inferredLocation;
        const bullets: string[] = [];
        if (typeof inferredMax === 'number') {
          if (target.Price <= inferredMax) bullets.push('**Dentro do seu orçamento**');
          else bullets.push(`**Acima do seu orçamento** (R$ ${target.Price.toLocaleString('pt-BR')} > R$ ${inferredMax.toLocaleString('pt-BR')})`);
        }
        if (target.Powertrain === 'electric') bullets.push('**Elétrico** (zero emissões)');
        if (target.Body === 'suv') bullets.push('**SUV** com versatilidade');
        if (typeof target.Seats === 'number') bullets.push(`${target.Seats} assentos`);
        bullets.push(`Disponível em ${target.Location}`);

        const detailsMsg = [
          `Aqui estão mais detalhes do **${target.Name} ${target.Model}**:`,
          `- Preço: **R$ ${target.Price.toLocaleString('pt-BR')}**`,
          ...bullets.map((b) => `- ${b}`),
          '',
          'Quer ver o **interior** ou a visão **3/4**? Posso destacar os pontos fortes para o seu uso.',
          '**Quer que eu separe essa opção para você?**',
        ].join('\n');

        return NextResponse.json({
          message: detailsMsg,
          cars: [target],
          success: true,
        });
      }
      // fall through to normal flow if not resolved
    }

    // Helper: build salesman-style message
    const buildSalesmanMessage = (primary: Car[], opts: { budget?: number; userUF?: string; requestedUF?: string; similarInRegion?: Car[]; similar?: Car[]; stretch?: Car[]; contextNote?: string }) => {
      const first = primary[0];
      const bullets: string[] = [];
      if (opts.userUF && cityToUf[normalize(first.Location)] === opts.userUF) bullets.push('**Disponível na sua região** (entrega rápida)');
      if (typeof opts.budget === 'number') {
        if (first.Price <= opts.budget) bullets.push('**Dentro do seu orçamento**');
        else bullets.push(`**Acima do seu orçamento** (R$ ${first.Price.toLocaleString('pt-BR')} > R$ ${opts.budget.toLocaleString('pt-BR')}). Condições de **financiamento** e ótimo **valor de revenda**.`);
      }
      const tags = Array.isArray(first.Tags) ? first.Tags : [];
      if (tags.includes('economy')) bullets.push('**Econômico** no dia a dia');
      if (tags.includes('tech')) bullets.push('Pacote **tecnológico** completo');
      if (tags.includes('comfort')) bullets.push('Ótimo **conforto** e acabamento');
      if (tags.includes('family')) bullets.push('Bom para **família**');
      if (first.Body === 'suv') bullets.push('**SUV** com altura e versatilidade');

      const lines: string[] = [];
      lines.push(`Aqui está uma ótima opção para você: **${first.Name} ${first.Model}**.`);
      lines.push('- ' + bullets.filter(Boolean).slice(0, 5).join('\n- '));
      if (Array.isArray(opts.similar) && opts.similar.length > 0) {
        lines.push('\nTambém separei **opções dentro do seu orçamento** com ótimo custo-benefício.');
      }
      if (Array.isArray(opts.similarInRegion) && opts.similarInRegion.length > 0) {
        lines.push('\nTambém separei alternativas na sua região com ótimo custo-benefício.');
      }
      if (opts.contextNote) lines.push(`\n${opts.contextNote}`);
      lines.push('\n**Quer que eu separe essa opção para você?**');
      return lines.join('\n');
    };

    // Rule-based handling for explicit brand+model queries (test cases coverage)
    // brand+model detection for other handlers
    const detectedBrand = uniqueBrands.find((b) => b && normMsg.includes(b));
    const detectedModel = uniqueModels.find((m) => m && normMsg.includes(m));

    if (detectedBrand && detectedModel) {
      // Try user region first
      const userUF = inferredLocation;
      const tryInRegionBudgeted = async () => JSON.parse(await searchCarsFunc({ name: detectedBrand, model: detectedModel, location: userUF, maxPrice: inferredMax ?? undefined }));
      const tryInRegionUnpriced = async () => JSON.parse(await searchCarsFunc({ name: detectedBrand, model: detectedModel, location: userUF }));
      const tryAnywhereBudgeted = async () => JSON.parse(await searchCarsFunc({ name: detectedBrand, model: detectedModel, maxPrice: inferredMax ?? undefined }));
      const tryAnywhereUnpriced = async () => JSON.parse(await searchCarsFunc({ name: detectedBrand, model: detectedModel }));

      let inRegionBudgeted = { count: 0, results: [] as Car[] };
      let inRegionUnpriced = { count: 0, results: [] as Car[] };
      if (userUF) {
        inRegionBudgeted = await tryInRegionBudgeted();
        inRegionUnpriced = await tryInRegionUnpriced();
      }
      const anywhereBudgeted = await tryAnywhereBudgeted();
      const anywhereUnpriced = await tryAnywhereUnpriced();

      // Choose primary set prioritizing region, then budgeted anywhere, then unpriced anywhere
      const base = inRegionBudgeted.count > 0
        ? inRegionBudgeted
        : (inRegionUnpriced.count > 0
          ? inRegionUnpriced
          : (anywhereBudgeted.count > 0 ? anywhereBudgeted : anywhereUnpriced));
      const foundInRegion = (inRegionBudgeted.count ?? 0) > 0 || (inRegionUnpriced.count ?? 0) > 0;

      // If nothing found at all (data inconsistency), fall back to LLM
      if ((base.count ?? 0) === 0) {
        // continue normal flow (LLM)
      } else {
        const primary = base.results as Car[];

        // Case 2: asked price below available
        let similar: Car[] = [];
        let stretch: Car[] = [];
        if (typeof inferredMax === 'number') {
          const budget = inferredMax;
          const withinBudget = (cars || []).filter((c) => c.Price <= budget).sort((a, b) => a.Price - b.Price).slice(0, 2);
          const slightlyOver = (cars || []).filter((c) => c.Price > budget && c.Price <= budget * 1.15).sort((a, b) => a.Price - b.Price).slice(0, 2);
          similar = withinBudget;
          stretch = slightlyOver;
        }

        // Case 3: exists but not in user region → add similar in region
        let similarInRegion: Car[] = [];
        if (userUF && !foundInRegion) {
          const body = primary[0].Body;
          const tags = primary[0].Tags || [];
          similarInRegion = (cars || []).filter((c) => {
            const sameUF = cityToUf[normalize(c.Location)] === userUF;
            const bodyMatch = body ? c.Body === body : false;
            const tagOverlap = Array.isArray(c.Tags) && c.Tags.some((t) => (tags as string[]).includes(t));
            return sameUF && (bodyMatch || tagOverlap);
          }).slice(0, 3);
          // Fallback: if none matched by body/tags, just pick cheapest locally
          if (similarInRegion.length === 0) {
            similarInRegion = (cars || [])
              .filter((c) => cityToUf[normalize(c.Location)] === userUF)
              .sort((a, b) => a.Price - b.Price)
              .slice(0, 2);
          }
        }

        const contextNote = userUF && !foundInRegion
          ? 'O modelo está disponível fora da sua região. Sugeri alternativas locais parecidas.'
          : undefined;

        const messageText = buildSalesmanMessage(primary, {
          budget: inferredMax,
          userUF,
          requestedUF: userUF,
          similarInRegion,
          similar,
          stretch,
          contextNote,
        });

        // Merge similar (within budget) first, then primary, then stretch and region similars (avoid duplicates)
        const allCars = [...similar, ...primary, ...stretch, ...similarInRegion];
        const seen = new Set<string>();
        const deduped = allCars.filter((c) => {
          const key = `${c.Name}|${c.Model}|${c.Location}|${c.Price}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }).slice(0, 6);

        return NextResponse.json({
          message: messageText,
          cars: deduped,
          success: true,
        });
      }
    }

    // Model-only handling: choose best option for that model, acknowledge budget, suggest alternatives
    if (!detectedBrand && detectedModel) {
      const userUF = inferredLocation;
      const modelCars = (cars || []).filter((c) => normalize(c.Model) === detectedModel);
      if (modelCars.length > 0) {
        const inRegionModel = userUF
          ? modelCars.filter((c) => cityToUf[normalize(c.Location)] === userUF)
          : [];
        const cheapestInRegion = inRegionModel.sort((a, b) => a.Price - b.Price)[0];
        const cheapestAnywhere = modelCars.sort((a, b) => a.Price - b.Price)[0];
        const primary = [cheapestInRegion || cheapestAnywhere].filter(Boolean) as Car[];

        // Alternatives by budget and slight stretch
        let similar: Car[] = [];
        let stretch: Car[] = [];
        if (typeof inferredMax === 'number') {
          const budget = inferredMax;
          similar = (cars || [])
            .filter((c) => c.Price <= budget)
            .sort((a, b) => a.Price - b.Price)
            .slice(0, 3);
          stretch = (cars || [])
            .filter((c) => c.Price > budget && c.Price <= budget * 1.15)
            .sort((a, b) => a.Price - b.Price)
            .slice(0, 2);
        }

        let similarInRegion: Car[] = [];
        const primaryInRegion = cheapestInRegion && cityToUf[normalize(cheapestInRegion.Location)] === userUF;
        if (userUF && !primaryInRegion) {
          const body = primary[0].Body;
          const tags = primary[0].Tags || [];
          similarInRegion = (cars || [])
            .filter((c) => {
              const sameUF = cityToUf[normalize(c.Location)] === userUF;
              const bodyMatch = body ? c.Body === body : false;
              const tagOverlap = Array.isArray(c.Tags) && c.Tags.some((t) => (tags as string[]).includes(t));
              return sameUF && (bodyMatch || tagOverlap);
            })
            .slice(0, 3);
          // Fallback: cheapest local picks if no tag/body matches
          if (similarInRegion.length === 0) {
            similarInRegion = (cars || [])
              .filter((c) => cityToUf[normalize(c.Location)] === userUF)
              .sort((a, b) => a.Price - b.Price)
              .slice(0, 2);
          }
        }

        let contextNote: string | undefined;
        if (typeof inferredMax === 'number' && primary[0].Price > inferredMax) {
          contextNote = 'A versão mais barata disponível desse modelo está acima do seu orçamento.';
        }
        if (userUF && !primaryInRegion) {
          contextNote = contextNote
            ? contextNote + ' Também selecionei alternativas locais parecidas.'
            : 'O modelo está disponível fora da sua região. Selecionei alternativas locais parecidas.';
        }

        const messageText = buildSalesmanMessage(primary, {
          budget: inferredMax,
          userUF,
          requestedUF: userUF,
          similar,
          similarInRegion,
          stretch,
          contextNote,
        });

        const allCars = [...similar, ...primary, ...stretch, ...similarInRegion];
        const seen = new Set<string>();
        const deduped = allCars
          .filter((c) => {
            const key = `${c.Name}|${c.Model}|${c.Location}|${c.Price}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .slice(0, 6);

        return NextResponse.json({ message: messageText, cars: deduped, success: true });
      }
      // else proceed with normal flow (LLM)
    }

    // Brand-only handling: choose cheapest model of the brand, acknowledge budget gap, suggest alternatives
    if (detectedBrand && !detectedModel) {
      const userUF = inferredLocation;
      const brandCars = (cars || []).filter((c) => normalize(c.Name) === detectedBrand);
      if (brandCars.length > 0) {
        // Prefer in-region cheapest if available
        const inRegionBrand = userUF
          ? brandCars.filter((c) => cityToUf[normalize(c.Location)] === userUF)
          : [];
        const cheapestInRegion = inRegionBrand.sort((a, b) => a.Price - b.Price)[0];
        const cheapestAnywhere = brandCars.sort((a, b) => a.Price - b.Price)[0];
        const primary = [cheapestInRegion || cheapestAnywhere].filter(Boolean) as Car[];

        // Alternatives within budget and slight stretch
        let similar: Car[] = [];
        let stretch: Car[] = [];
        if (typeof inferredMax === 'number') {
          const budget = inferredMax;
          similar = (cars || []).filter((c) => c.Price <= budget).sort((a, b) => a.Price - b.Price).slice(0, 3);
          stretch = (cars || []).filter((c) => c.Price > budget && c.Price <= budget * 1.15).sort((a, b) => a.Price - b.Price).slice(0, 2);
        }

        // Similar in region if primary not in region
        let similarInRegion: Car[] = [];
        if (userUF && (!cheapestInRegion || cityToUf[normalize(primary[0].Location)] !== userUF)) {
          const body = primary[0].Body;
          const tags = primary[0].Tags || [];
          similarInRegion = (cars || []).filter((c) => {
            const sameUF = cityToUf[normalize(c.Location)] === userUF;
            const bodyMatch = body ? c.Body === body : false;
            const tagOverlap = Array.isArray(c.Tags) && c.Tags.some((t) => (tags as string[]).includes(t));
            return sameUF && (bodyMatch || tagOverlap);
          }).slice(0, 3);
        }

        const contextNote = typeof inferredMax === 'number' && primary[0].Price > inferredMax
          ? `A opção mais barata da marca está acima do seu orçamento.`
          : undefined;

        const messageText = buildSalesmanMessage(primary, {
          budget: inferredMax,
          userUF,
          requestedUF: userUF,
          similar,
          similarInRegion,
          stretch,
          contextNote,
        });

        const allCars = [...similar, ...primary, ...stretch, ...similarInRegion];
        const seen = new Set<string>();
        const deduped = allCars.filter((c) => {
          const key = `${c.Name}|${c.Model}|${c.Location}|${c.Price}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }).slice(0, 6);

        return NextResponse.json({
          message: messageText,
          cars: deduped,
          success: true,
        });
      }
      // else proceed with normal flow (LLM)
    }

    // Fallbacks (sem LLM) quando API key ausente ou pedido de "todos os carros"
    if (askAll) {
      console.log('[chat] Fallback: returning all cars for "all cars" request');
      return NextResponse.json({
        message: 'Aqui estão todos os carros disponíveis. Quer que eu destaque os melhores custo-benefício?',
        cars,
        success: true,
      });
    }

    if (!hasApiKey) {
      console.warn('[chat] OPENAI_API_KEY ausente. Usando busca local básica.');
      // Heurística simples: tenta localizar por localização, marca e modelo usando o dataset
      const uniqueLocations = Array.from(new Set(cars.map((c) => normalize(c.Location))));
      const uniqueBrands = Array.from(new Set(cars.map((c) => normalize(c.Name))));
      const uniqueModels = Array.from(new Set(cars.map((c) => normalize(c.Model))));

      const detectPowertrain = (): string | undefined => {
        if (/(eletric|el[eé]tric|ev|el[eé]trico)/.test(normMsg)) return 'electric';
        if (/(h[ií]brido|hibrid)/.test(normMsg)) return 'hybrid';
        if (/(diesel)/.test(normMsg)) return 'diesel';
        if (/(gasolina)/.test(normMsg)) return 'gasoline';
        if (/(flex)/.test(normMsg)) return 'flex';
        return undefined;
      };
      const detectBody = (): string | undefined => {
        if (/\bsuv\b/.test(normMsg)) return 'suv';
        if (/(sed[aã]n|sedan)/.test(normMsg)) return 'sedan';
        if (/(hatch|hatchback)/.test(normMsg)) return 'hatch';
        return undefined;
      };

      const detected = {
        location: uniqueLocations.find((loc) => loc && normMsg.includes(loc)),
        name: uniqueBrands.find((b) => b && normMsg.includes(b)),
        model: uniqueModels.find((m) => m && normMsg.includes(m)),
        powertrain: detectPowertrain(),
        body: detectBody(),
        maxPrice: inferredMax,
      } as any;

      const result = await searchCarsFunc(detected);
      const parsed = JSON.parse(result);
      return NextResponse.json({
        message:
          parsed.count > 0
            ? 'Encontrei estas opções para você.'
            : 'Não encontrei resultados exatos. Posso sugerir alternativas próximas?',
        cars: parsed.results ?? [],
        success: true,
      });
    }

    const model = new ChatOpenAI({
      apiKey,
      model: 'gpt-4o-mini',
      temperature: 0.6,
    }).bindTools([
      {
        type: 'function',
        function: {
          name: 'search_cars',
          description:
            'Busca carros no dataset local por marca, modelo, localização, powertrain (ex: electric), carroceria (ex: suv) e faixa de preço. Use quando precisar listar opções ou validar disponibilidade.',
          parameters: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Marca do carro (ex: Honda, BYD)' },
              model: { type: 'string', description: 'Modelo do carro (ex: Civic, Dolphin)' },
              location: { type: 'string', description: 'Cidade ou estado (ex: São Paulo, SP)' },
              minPrice: { type: 'number', description: 'Preço mínimo em BRL' },
              maxPrice: { type: 'number', description: 'Preço máximo em BRL' },
              powertrain: { type: 'string', enum: ['electric','hybrid','flex','gasoline','diesel'], description: 'Tipo de motorização' },
              body: { type: 'string', enum: ['hatch','sedan','suv'], description: 'Tipo de carroceria' },
              minSeats: { type: 'number', description: 'Número mínimo de assentos' },
              tags: { type: 'array', items: { type: 'string' }, description: 'Tags desejadas (ex: family, city, economy, tech)' },
              limit: { type: 'integer', minimum: 1, maximum: 12, description: 'Limite de resultados' },
            },
            additionalProperties: false,
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'recommend_cars',
          description:
            'Recomenda carros com base no perfil do usuário (uso, orçamento, família, preferências EV/tecnologia). Use quando o usuário pedir sugestão ou melhor opção para o perfil.',
          parameters: {
            type: 'object',
            properties: {
              budget: { type: 'number', description: 'Orçamento máximo em BRL' },
              location: { type: 'string', description: 'Cidade ou estado (ex: São Paulo, SP)' },
              usage: { type: 'string', enum: ['city','highway','mixed'], description: 'Uso principal' },
              familySize: { type: 'number', description: 'Número de pessoas na família' },
              preferSUV: { type: 'boolean', description: 'Prefere SUV' },
              preferEV: { type: 'boolean', description: 'Prefere carro elétrico' },
              wantsTech: { type: 'boolean', description: 'Valoriza tecnologia' },
              needsCargo: { type: 'boolean', description: 'Precisa de bom porta-malas' },
              limit: { type: 'integer', minimum: 1, maximum: 12, description: 'Limite de resultados' },
            },
            additionalProperties: false,
          },
        },
      },
    ]);

    const system = new SystemMessage(
      [
        'Você é o CarFinder AI: um especialista em carros que ajuda usuários a encontrar e decidir a compra.',
        'Diretrizes:',
        '- Sempre USE as ferramentas (search_cars/recommend_cars). Para listar ou checar disponibilidade/preço use search_cars. Para "qual o melhor para meu uso/perfil" use recommend_cars.',
        '- Use o histórico da conversa. Se o usuário já informou localização, orçamento ou preferências, NÃO repita a pergunta.',
        '- Se faltar informação (ex: localização, orçamento, preferências), faça no máximo 1 pergunta curta e objetiva antes de recomendar.',
        '- Quando o orçamento for menor que os preços encontrados, sugira alternativas próximas e benefícios (financiamento, economia de combustível, valor de revenda).',
        '- Quando a localização não bater, sugira opções similares na região do usuário e destaque vantagens.',
        '- MODO VENDEDOR: ao tratar de um veículo específico ou 1-2 opções, assuma postura consultiva. Destaque 3-5 motivos práticos alinhados ao perfil do usuário, antecipe objeções comuns (consumo, seguro, manutenção) e finalize com um convite de próxima etapa.',
        '- Use linguagem persuasiva, mas honesta. Destaque pontos fortes do veículo e do perfil do usuário.',
        '- Sobre imagens: prefira ângulo 3/4 (quarter) para destaque visual, lateral (side) para proporções, traseira (back) para porta-malas e interior (interior) para conforto/tecnologia.',
        '- Se o usuário pedir "todos os carros" ou resultados amplos, chame search_cars SEM filtros e sem limitar (retorne todos disponíveis).',
        '- Ao procurar por elétricos/híbridos, passe explicitamente powertrain (electric/hybrid). Por SUV/sedã/hatch, passe body (suv/sedan/hatch).',
        '- Sempre que souber orçamento e localização, inclua maxPrice e location na chamada da ferramenta.',
        '- CASOS DE TESTE: (1) Se o carro existe no JSON, retorne ele chamando search_cars com filtros precisos (marca+modelo) e triggere o modo vendedor. (2) Se o usuário pedir um carro existente por um valor abaixo do disponível, chame search_cars com maxPrice e, se vazio, repita com maxPrice ~10-15% maior OU chame recommend_cars e destaque financiamento/benefícios e 1-2 alternativas próximas. (3) Se o carro existir em outra localidade, chame search_cars com a localização informada; se vier vazio, repita SEM location para achar a disponibilidade real e sugira: (a) o mesmo modelo fora da região, e (b) 1-2 similares na região do usuário, explicando prós e contras.',
        'Formato da resposta: Comece com uma frase curta. Em seguida, use uma lista com hifens para destacar razões de compra e o porquê da recomendação. Use negrito com ** para pontos-chave. Evite texto excessivo, não invente informações. Depois da lista, finalize com um CTA curto. NÃO inclua markdown de imagem nem links de imagens; as fotos serão exibidas pela interface.',
        '- Ao finalizar, inclua um call-to-action curto (ex: **Quer que eu separe essa opção para você?**).',
      ].join(' ')
    );

    const contextLines: string[] = [];
    if (inferredLocation) contextLines.push(`Localização: ${inferredLocation.toUpperCase()}`);
    if (inferredMax) contextLines.push(`Orçamento máximo: R$ ${inferredMax}`);
    const contextMsg = contextLines.length > 0
      ? new SystemMessage(`Contexto do usuário (do histórico): ${contextLines.join(' | ')}`)
      : undefined;

    const conversation: (SystemMessage | HumanMessage | AIMessage | ToolMessage)[] = [system];
    if (contextMsg) conversation.push(contextMsg);
    for (const h of recentHistory) {
      if (h.role === 'user') conversation.push(new HumanMessage(h.content));
      else conversation.push(new AIMessage(h.content));
    }
    conversation.push(new HumanMessage(message));

    let lastSearchResults: Car[] | undefined;

    for (let i = 0; i < 3; i++) {
      const ai = (await model.invoke(conversation)) as AIMessage;
      console.log('[chat] LLM responded', { hasToolCalls: Boolean((ai as any).tool_calls?.length) });
      // Inclui a mensagem do assistente (fará sentido no histórico para o próximo passo)
      conversation.push(ai);
      const toolCalls: any[] = (ai as any).tool_calls ?? (ai as any).additional_kwargs?.tool_calls ?? [];

      if (Array.isArray(toolCalls) && toolCalls.length > 0) {
        for (const call of toolCalls) {
          const name: string | undefined = call.name ?? call.function?.name;
          const argsStr: string = call.args ? JSON.stringify(call.args) : call.function?.arguments ?? '{}';
          let result = '';
          if (name === 'search_cars') {
            try {
              const parsed = JSON.parse(argsStr);
              result = await searchCarsFunc(parsed);
              const parsedResult = JSON.parse(result);
              if (parsedResult && Array.isArray(parsedResult.results)) {
                lastSearchResults = parsedResult.results as Car[];
              }
            } catch (err) {
              result = JSON.stringify({ error: 'Falha ao buscar carros', details: err instanceof Error ? err.message : String(err) });
            }
          } else if (name === 'recommend_cars') {
            try {
              const parsed = JSON.parse(argsStr);
              result = await recommendCarsFunc(parsed);
              const parsedResult = JSON.parse(result);
              if (parsedResult && Array.isArray(parsedResult.results)) {
                lastSearchResults = parsedResult.results as Car[];
              }
            } catch (err) {
              result = JSON.stringify({ error: 'Falha ao recomendar carros', details: err instanceof Error ? err.message : String(err) });
            }
          } else {
            result = JSON.stringify({ error: `Ferramenta desconhecida: ${name}` });
          }
          const toolCallId: string = call.id ?? call.tool_call_id ?? 'tool_call';
          conversation.push(new ToolMessage({ content: result, tool_call_id: toolCallId }));
        }
        // Continue o loop para permitir que o modelo use os resultados das ferramentas
        continue;
      }

      // Resposta final do assistente
      return NextResponse.json({
        message: ai.content,
        cars: lastSearchResults ?? [],
        success: true,
      });
    }

    // Se exceder o número de iterações sem resposta final
    return NextResponse.json({
      message: 'Encontrei algumas opções interessantes! Quer me dizer sua faixa de preço e cidade para eu refinar?',
      cars: lastSearchResults ?? [],
      success: true,
    });
  } catch (error) {
    console.error('Erro na API de chat:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Chat funcionando!',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
