import { NextRequest, NextResponse } from "next/server"

interface CheckChaptersRequest {
  url: string
  mangaTitle: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckChaptersRequest = await request.json()
    const { url, mangaTitle } = body

    if (!url) {
      return NextResponse.json(
        { error: "URL é obrigatória" },
        { status: 400 }
      )
    }

    // Tentar fazer fetch da página
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      })

      if (!response.ok) {
        return NextResponse.json(
          { 
            error: "Não foi possível acessar o site",
            maxEpisode: null 
          },
          { status: 400 }
        )
      }

      const html = await response.text()

      // Estratégia melhorada: Focar na lista de capítulos e pegar o maior número válido
      let maxEpisode: number | null = null
      const foundNumbers: number[] = []

      // 1. Procurar especificamente por padrões de capítulos em listas (mais confiável)
      // Padrões específicos para sites brasileiros como leituramanga.com
      const chapterListPatterns = [
        // "Capítulo 106 NEW" ou "Capítulo 106"
        /cap[íi]tulo\s+(\d+)(?:\s+NEW)?/gi,
        // Links com capítulo: href="/manga/.../capitulo-106"
        /cap[íi]tulo[_-]?(\d+)/gi,
        // Em elementos de lista: <a>Capítulo 106</a>
        /<a[^>]*>.*?cap[íi]tulo\s+(\d+)/gi,
        // Em listas ordenadas: <li>Capítulo 106</li>
        /<li[^>]*>.*?cap[íi]tulo\s+(\d+)/gi,
        // Data attributes: data-chapter="106"
        /data-chapter[^=]*=["'](\d+)["']/gi,
        // Em divs com classe relacionada a capítulo
        /<div[^>]*class[^>]*cap[^>]*>.*?(\d+)/gi,
      ]

      // 2. Procurar na seção de capítulos especificamente
      // Tentar extrair a seção de capítulos primeiro
      const chapterSectionPatterns = [
        /<section[^>]*cap[íi]tulos?[^>]*>(.*?)<\/section>/is,
        /<div[^>]*cap[íi]tulos?[^>]*>(.*?)<\/div>/is,
        /cap[íi]tulos?[^<]*(<[^>]*>.*?<\/[^>]*>)/is,
      ]

      let chapterSection = html
      for (const pattern of chapterSectionPatterns) {
        const match = html.match(pattern)
        if (match && match[1]) {
          chapterSection = match[1]
          break
        }
      }

      // 3. Procurar números de capítulos no conteúdo
      // Priorizar a seção de capítulos, mas também procurar no HTML completo
      const searchAreas = [chapterSection, html]

      for (const searchArea of searchAreas) {
        for (const pattern of chapterListPatterns) {
          const matches = searchArea.matchAll(pattern)
          for (const match of matches) {
            const num = parseInt(match[1], 10)
            // Validação mais restritiva: apenas números razoáveis (1-2000)
            // Filtrar números muito altos que provavelmente são erros (como 200 de largura de imagem)
            if (num && num > 0 && num <= 2000 && !foundNumbers.includes(num)) {
              foundNumbers.push(num)
            }
          }
        }
      }

      // 4. PRIORIDADE MÁXIMA: Procurar por "Capítulo X NEW" primeiro (mais confiável)
      // Isso indica que é o capítulo mais recente e atual
      // Usar busca case-insensitive e procurar especificamente por "NEW" próximo ao número
      const newChapterRegex = /cap[íi]tulo\s+(\d+)\s*NEW/gi
      const newMatches = Array.from(html.matchAll(newChapterRegex))
      
      if (newMatches.length > 0) {
        // Pegar o PRIMEIRO match com NEW (geralmente é o mais recente na lista, como "Capítulo 106 NEW")
        // Ordenar por posição no HTML para garantir que pegamos o primeiro que aparece
        const sortedNewMatches = newMatches.sort((a, b) => (a.index || 0) - (b.index || 0))
        const firstNewMatch = sortedNewMatches[0]
        const num = parseInt(firstNewMatch[1], 10)
        if (num && num > 0 && num <= 2000) {
          maxEpisode = num
          console.log(`[DEBUG] ✅ Encontrado capítulo com NEW: ${num} (primeiro na lista)`)
          foundNumbers.push(num)
          // Se encontrou com NEW, não procurar mais - esse é o valor correto
          // Pular para o retorno
        }
      }
      
      // Se não encontrou com NEW, tentar outras variações
      if (!maxEpisode) {
        const newestChapterPatterns = [
          /cap[íi]tulo\s+(\d+)[^<]*(?:NEW|novo|latest|último)/gi,
        ]
        
        for (const pattern of newestChapterPatterns) {
          const matches = Array.from(html.matchAll(pattern))
          if (matches.length > 0) {
            const firstMatch = matches[0]
            const num = parseInt(firstMatch[1], 10)
            if (num && num > 0 && num <= 2000) {
              foundNumbers.push(num)
              if (!maxEpisode) {
                maxEpisode = num
                console.log(`[DEBUG] Encontrado capítulo recente: ${num}`)
              }
            }
          }
        }
      }

      // Se já encontrou com NEW, retornar imediatamente (mais confiável)
      if (maxEpisode) {
        console.log(`[DEBUG] ✅ Retornando capítulo encontrado com NEW: ${maxEpisode}`)
        return NextResponse.json({
          success: true,
          maxEpisode,
          found: true,
          message: `Encontrado: ${maxEpisode} capítulos (marcado como NEW)`,
          method: "new_marker"
        })
      }

      // 4.1. Se não encontrou com NEW, tentar pegar o primeiro capítulo da lista
      // (geralmente listas mostram do mais recente para o mais antigo)
      if (!maxEpisode) {
        // Procurar pelo primeiro "Capítulo X" na seção de capítulos
        const firstChapterMatch = chapterSection.match(/cap[íi]tulo\s+(\d+)/i)
        if (firstChapterMatch) {
          const num = parseInt(firstChapterMatch[1], 10)
          if (num && num > 0 && num <= 2000) {
            foundNumbers.push(num)
            // Se o primeiro capítulo encontrado é razoável, usar como candidato
            if (num > 0 && num <= 500) {
              maxEpisode = num
              console.log(`[DEBUG] Usando primeiro capítulo da lista: ${num}`)
            }
          }
        }
      }

      // 5. Se ainda não encontrou, usar lógica de validação melhorada
      if (!maxEpisode && foundNumbers.length > 0) {
        // Remover duplicatas e ordenar
        const uniqueNumbers = [...new Set(foundNumbers)].sort((a, b) => b - a)
        
        console.log(`[DEBUG] Números encontrados: ${uniqueNumbers.join(', ')}`)
        
        // Filtrar números muito altos que são provavelmente erros
        // (como dimensões de imagem, IDs, etc)
        // Mas permitir até 2000 para mangás longos
        const reasonableNumbers = uniqueNumbers.filter(n => n <= 2000 && n >= 1)
        
        if (reasonableNumbers.length > 0) {
          // Se temos números razoáveis, usar o maior
          maxEpisode = reasonableNumbers[0]
          console.log(`[DEBUG] Usando maior número razoável: ${maxEpisode}`)
        } else if (uniqueNumbers.length > 0) {
          // Se só temos números altos, verificar se fazem sentido
          // Se o maior não é muito maior que o segundo, pode ser válido
          if (uniqueNumbers.length === 1) {
            // Apenas um número - se for razoável, usar
            if (uniqueNumbers[0] <= 2000) {
              maxEpisode = uniqueNumbers[0]
              console.log(`[DEBUG] Usando único número encontrado: ${maxEpisode}`)
            }
          } else {
            const largest = uniqueNumbers[0]
            const secondLargest = uniqueNumbers[1]
            
            // Se a diferença é pequena (menos de 20 capítulos), é provável que seja válido
            // Ou se o maior número é menor que 300, provavelmente é válido
            if (largest - secondLargest <= 20 || largest < 300) {
              maxEpisode = largest
              console.log(`[DEBUG] Diferença pequena ou número baixo, usando maior: ${maxEpisode}`)
            } else {
              // Diferença grande - provavelmente o maior é um erro (como 200 de largura)
              // Usar o segundo maior se for razoável (menor que 500)
              if (secondLargest <= 500) {
                maxEpisode = secondLargest
                console.log(`[DEBUG] ⚠️ Diferença grande detectada (${largest} vs ${secondLargest}), usando segundo maior: ${maxEpisode}`)
              } else {
                // Se o segundo também é alto, pode ser que ambos sejam válidos
                // Mas vamos ser conservadores e usar o segundo
                maxEpisode = secondLargest
                console.log(`[DEBUG] Ambos números são altos, usando segundo: ${maxEpisode}`)
              }
            }
          }
        }
      }

      // Log final para debug
      console.log(`[DEBUG] Resultado final para ${url}: maxEpisode = ${maxEpisode}`)
      
      // Se não encontrou, retornar null (usuário pode inserir manualmente)
      return NextResponse.json({
        success: true,
        maxEpisode,
        found: maxEpisode !== null,
        message: maxEpisode 
          ? `Encontrado: ${maxEpisode} capítulos` 
          : "Não foi possível detectar automaticamente. Você pode inserir manualmente.",
        debug: {
          foundNumbers: foundNumbers.slice(0, 10), // Primeiros 10 para debug
          uniqueCount: [...new Set(foundNumbers)].length
        }
      })
    } catch (fetchError) {
      console.error("Erro ao fazer fetch:", fetchError)
      return NextResponse.json(
        { 
          error: "Erro ao acessar o site",
          maxEpisode: null,
          message: "Não foi possível acessar o site. Verifique a URL ou insira o número manualmente."
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Erro na API:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor", maxEpisode: null },
      { status: 500 }
    )
  }
}

