---
title: "La IA no piensa: guÃ­a de arquitectura y checklist anti-alucinaciones"
description: "Por quÃ© los LLM suenan como ingenieros senior mientras inventan APIs, el mapa de decisiÃ³n de 4 niveles y la checklist prÃ¡ctica para tus code reviews."
date: 2026-10-24
tags: ["inteligencia-artificial", "arquitectura", "desarrollo-software", "llm", "code-review"]
draft: false
---

Le haces una pregunta tÃ©cnica a un modelo de inteligencia artificial. Te responde con una seguridad pasmosa, una sintaxis impecable, nombres de variables elegantes y comentarios claros.

Copias el cÃ³digo, lo pegas en tu proyecto... y explota. Resulta que el mÃ©todo que te sugiriÃ³ no existe en la versiÃ³n de la librerÃ¡a que usas, o peor: se inventÃ³ un parÃ¡metro con un nombre perfectamente lÃ³gico que jamÃ¡s existiÃ³ en la documentaciÃ³n.

ÿTe ha pasado?

Es la trampa mÃ¡s comÃºn cuando empezamos a programar con IA: **confundir elocuencia con comprensiÃ³n**. El modelo no razona como tÃº y yo cuando diseÃ±amos un sistema. No sabe lo que es un bug, no siente frustraciÃ³n cuando un build falla ni tiene un mapa mental de tu arquitectura.

Para construir software sÃ³lido con estas herramientas, necesitamos desmitificarlas. En este artÃ­culo te explico sin humo quÃ© estÃ¡ pasando realmente por dentro, el mapa de decisiÃ³n para saber cuÃ¡ndo te conviene usar cada nivel de tecnologÃ¯a y la checklist prÃ¡ctica que uso a diario para auditar Pull Requests generados con IA.

---

HÈKˆH°ìÜ›][HÚ[ˆZ\İ\š[Îˆ]pêHXÙH™X[Y[H[ˆB‚‘[ˆH]\˜]\˜HXØY0ê[ZXØH™\°è\È]YH[ˆ[Ù[È]]Üœ™YÜ™\Ú]›ÈÙH\ØÜšX™H›Ü›X[Y[HÛÛˆ[˜HXİXXÚpìÛˆÛÛ[È\İN‚‚‰	\™×X^Şİ×İH
×İZY×ÌK×Ì‹İË×ŞİL_JI	‚”ÚH[˜ØH\ÈÚYÈ˜[ˆHH›İXÚpìÛˆX][pè]XØK\İÈYYHÛÛ˜\ˆ[[ZY[Kˆ\›È]\œšXğê[[ÜÛÈHğìÙYÛÈH0ìÙÚXØHÛİYX[˜N‚‚Šˆ
Š×ÌK×Ì‹İË×ŞİL_JŠˆ\È[ÛÛ^ÈXİ[][YÈ
H›Û\\È™YÛ\È[Ú\İ[XHHÙÈÈ]YH[[Ù[ÈXHH™[šYÈ\ØÜšXšY[™È[Xœ˜HÜˆ[Xœ˜JK‚Šˆ
Š”
×İZYİÊJŠˆ\ÈH\İšXXÚpìÛˆH›Ø˜Xš[YY]YH[[Ù[ÈØ[İ[Nˆ
ˆ‘YÈÈ]YH]˜[[ÜÈ\ØÜš]È\İH\]pëKÜ]pêH›Ø˜Xš[YYY[™HØYHÚÙ[ˆ[›ØØX[\š[ÈHÙ\ˆ[ÚYİZY[OÈŠ‚Šˆ
Š—\™×X^
ŠˆÚYÛšYšXØHÚ[\[Y[H[YÚ\ˆ[Ø[™Y]ÈÛÛˆX^[Üˆ›Ø˜Xš[YY
È]Y\İ™X\ˆ[™HÜÈYZ›Ü™\ÈØ[™Y]ÜÈÙYğî›ˆH[\\˜]\˜JK‚‚‘[ˆØØ\È[Xœ˜\Îˆ
Š™[[Ù[È\È[˜Hpè\]Z[˜H\İY0ë\İXØH]YH™YXÙH[ÚYİZY[Hœ˜YÛY[ÈH^ÊŠ‹‚‚ˆVğªĞğìÛ[ÈÙ[™\˜HğìÙYÛÈ[ˆH\ÛÈH\Û×JØ›ÙËİÚÙ[‹YÙ[™\˜][Û‹Y›İËœİ™ÊB‚‘[[Ù[È›ÈÛÛœİ[H[˜H˜\ÙHH]ÜÈH™\™YšHZ™Xİ]H[[0ê\œ™]HZY[˜\È\ØÜšX™KˆÚ[\[Y[H\ÛØÚXH™XİÜ™\ÈHXİ]˜XÚpìÛ‹ˆÜˆ\ÛËÚH[˜H[˜ÚpìÛˆ[™[YHİY[˜HÛÛš[˜Ù[H[ˆ[ÛÛ^ËHH˜HH[™YØ\ˆÛÛˆ[˜HÛÛœš\ØK‚‚‹KKB‚’‹ˆÜÈİX]›Èš]™[\Îˆİpè[™È\Ø\ˆ]pêB‚•[›ÈHÜÈ\œ›Ü™\ÈH\Ùpì[Èpè\ÈØ\›ŞÈŞH0ëXH\ÈY]\ˆ[ˆH\˜H\™X\È]YHÙH™\İY[™[ˆÛÛˆğìÙYÛÈ˜YXÚ[Û˜[HÙHHšYKˆ\˜H^]Y\HH[YÚ\ˆH\œ˜[ZY[HÛÜœ™XİK]šYÈ\ÈÛÛXÚ[Û™\È[ˆİX]›Èš]™[\È]^HÛ\›ÜÎ‚‚ˆVİX\HHXÚ\ÚpìÛˆ\œ]Z]Xİ0ìÛšXØWJØ›ÙËÙXÚ\Ú[Û‹[X\M[]™[Ëœİ™ÊB‚”ÚHY[™\È™YÛ\ÈH™YÛØÚ[ÈšZ˜\Ë
Š\ØHğìÙYÛÈ˜YXÚ[Û˜[
Š‹ˆZÜœ˜\È][˜ÚXKZ[\ÈH0ìÛ\™\È[ˆÚÙ[œÈHH]š]\ÈÛÜœ™\Ø\È›È]\›Z[š\İ\È[ˆ›ÙXØÚpìÛ‹‚‚‹KKB‚ˆÈËˆÜÈ™\È˜[ÜÈÚ[[˜Ú[ÜÛÜÈ[ˆ›ÙXØÚpìÛ‚‚İX[™È[ˆ\]Z\È[\Y^˜HH[˜ÛÜœÜ˜\ˆ\Ú\İ[\ÈHğìÙYÛÈH\ØØ[KİY[[ˆ\\™XÙ\ˆ™\È›ÜY^›ÜÈ™Xİ\œ™[\Î‚‚ˆÈÈÈKˆH[XÚ[˜XÚpìÛˆÚ[0èXİXØ[Y[H°è[YB‘[ğìÙYÛÈ\ØH[[\ˆH\TØÜš\ÛÛ\[HÚ[ˆ]YZ˜\ÈH\™XÙH\ØÜš]ÈÜˆ[ˆ\Ø\œ›ÛYÜˆÙ[š[Ü‹ˆ\›È[›ØØH[˜HTH]YHYH\™XØYHXÙHÜÈpì[ÜÈÈ\İ[YH]YH[ˆÙ\šXÚ[È]Y[™H[ˆ^[ØY]YH[˜ØHH]Y[Ëˆ\È[˜[Èpè\È[YÜ›ÜÛÈÜœ]YH[™ØpìXH°èXÚ[Y[H[™]š\ÛÜˆ[ˆ[[™\]Y\İ‚‚ˆÈÈÈ‹ˆHÙYİY\˜HHÛÛ^È[ˆ™\ÜÚ]Üš[ÜÈÜ˜[™\Â”Üˆpè\È]YHH™[[˜H[[Ù[ÈÙXHHHÈ‰›Z[Û™\ÈHÚÙ[œËH][˜ÚpìÛˆ›È\È[šY›Ü›YKˆÚHH\Ø\ÈY^ˆ\˜Ú]›ÜÈHÛÛK[[Ù[ÈY[™HHšZ˜\œÙH[ˆ[š[˜Ú\[ÈH[ˆ[š[˜[YÛ›Ü˜[™ÈYÙHØ\Ù\ÈÜ±êï‰Ç¬cos del medio.

##3 3. La delegaciÃ³n prematura
Decirle al agente: *"Arregla el bug del carrito de compras"* sin darle pistas de telemetrÃ¯a ni logs. El agente intentarÃ¡ resolverlo a ciegas modificando cosas que no tenÃ¡a que tocar. TÃº debes mantener el rol de arquitecto y darle la hipÃ³tesis acotada.

---

H 4. Checklist Anti-Alucinaciones para tus Code Reviews

Esta es la lista de chequeo prÃ¡ctica que te sugiero tener a mano antes de darle *Merge* a cualquier PR que contenga cÃ³digo asistido por IA:

* [ ] **1. VerificaciÃ³n de APIs y LibrerÃ¡as Externas:** Â¿Los mÃ©todos, parÃ¡metros y firmas invocados existen en la versiÃ³n exacta fijada en tu `package.json` o `requirements.txt`<
* [ ] **2. ValidaciÃ³n Determinista:** ¿El cÃ³digo incluye tests unitarios reales que fallaban antes del fix y que ahora pasan de forma reproducible?
* [ ] **3. Cero Efectos Secundarios Ocultos:** Â¿El diff se limita estrictamente al alcance de la tarea, o el modelo aprovechÃ³ para "refactorizar" mÃ©todos adyacentes sin pedirlo?
** [ ] **4. Manejo de Errores y Timeouts:** ¿QuÃ© pasa si el endpoint falla con un 502 o tarda 30 segundos? Los LLM tienden a pintar solo el *happy path**
* [ ] **5. Seguridad y Permisos:Â¯ÈŠ‘[ğìÙYÛÈ™\Ü]H[ÛÛ›ÛHXØÙ\ÛÈ˜\ØYÈ[ˆ›Û\È
PÊHHHØ[š]^˜XÚpìÛˆH[œ]ËÈ\İ[YH]YH]ZY[ˆ[XH\İ0èH]][XØYÏÂŠˆÈH
Š‹ˆÜš]\š[ÈH\œ]Z]Xİ\˜NŠŠˆ0¯Ñ\İÈÛÛXÚ[Û˜HHØ]\ØH˜pë^ˆ[›Ø›[XKÈÚ[\[Y[H\È[ˆ\˜ÚHÛÜÛpê]XÛÈ\˜HÚ[[˜ÚX\ˆH^Ù\ÚpìÛÂ‚‹KKB‚’0¯Ô]pêHÚYİYOÂ‘[ˆ[
Š‘\\ÛÙ[ÈŠŠˆHHÙ\šYH[ˆ[İUX™H˜[[ÜÈH™\ˆH0ìÛ™HØ[pìÈÙÈ\İÎˆÙ][Hpì[ÜÈH›ÜY^›ÜËÜÈ[šY\››ÜÈHH[[YÙ[˜ÚXH\YšXÚX[H[\\ˆHÛÛÙÛHHŒMÈ

][[Ûˆ\È[[İH™YY
ŠH]YHØ[XšpìÈH[™\İšXH\˜HÚY[\™K‚‚”ÚHY[™\È[İ[˜H™YÛHÈš[›È\œÛÛ˜[]YHH^XHØ[˜YÈH[ˆYÈ[ˆ›ÙXØÚpìÛ‹ÛÛ\0è\[H[ˆÜÈÛÛY[\š[ÜÈ[šY[Ëˆ0¨S›ÜÈ™[[ÜÈ[ˆ[°ìŞ[[ÈB