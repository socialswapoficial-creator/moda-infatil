// Catálogo de teste. Cada variante tem um identificador estável para uso por um painel.
export const store = { whatsapp: "" };
export const categories = [
  ["camisetas", "Camisetas", "shirt"],
  ["vestidos", "Vestidos", "dress"],
  ["shorts", "Shorts", "shorts"],
  ["bebes", "Bebês", "baby"],
  ["conjuntos", "Conjuntos", "set"],
  ["moletons", "Moletons", "hoodie"]
];

function product(id, category, name, price, color, sizes, colorHex) {
  return {
    id, category, name, price, image: id + ".webp", colorHex,
    variants: sizes.map(size => ({ id: id + "-" + size, color, size }))
  };
}

export const catalog = [
  product("camiseta", "camisetas", "Camiseta Sol Bordado", 4990, "Azul bebê", ["2", "4", "6", "8"], "#a8cce0"),
  product("vestido", "vestidos", "Vestido Xadrez de Algodão", 8990, "Amarelo manteiga", ["2", "4", "6", "8"], "#e9d48b"),
  product("short", "shorts", "Short Jeans Leve", 6490, "Jeans claro", ["4", "6", "8", "10"], "#8ea9bc"),
  product("body", "bebes", "Body Algodão Nuvem", 3990, "Creme", ["P", "M", "G"], "#e3d8bf"),
  product("conjunto", "conjuntos", "Conjunto Listras do Mar", 9990, "Azul e branco", ["2", "4", "6", "8"], "#9dbbd4"),
  product("moletom", "moletons", "Moletom Dia de Sol", 7990, "Amarelo manteiga", ["4", "6", "8", "10"], "#e9d48b"),
  product("camiseta-veleiro", "camisetas", "Camiseta Veleiro Bordado", 5290, "Branco", ["2", "4", "6", "8"], "#f3f1e7"),
  product("camiseta-margarida", "camisetas", "Camiseta Margarida", 4990, "Lilás", ["2", "4", "6", "8"], "#cbb7df"),
  product("vestido-coral", "vestidos", "Vestido de Algodão com Babados", 8490, "Coral", ["2", "4", "6", "8"], "#df8581"),
  product("vestido-jardim", "vestidos", "Vestido Jardim", 9290, "Verde menta", ["2", "4", "6", "8"], "#a9cbb5"),
  product("short-sarja", "shorts", "Short de Sarja", 6490, "Bege", ["4", "6", "8", "10"], "#c8af89"),
  product("short-marinheiro", "shorts", "Short de Malha com Cordão", 5590, "Azul marinho", ["4", "6", "8", "10"], "#314864"),
  product("body-menta", "bebes", "Body de Algodão Liso", 3990, "Verde menta", ["P", "M", "G"], "#b9d6c4"),
  product("body-nuvens", "bebes", "Body Chuva de Nuvens", 4290, "Rosa claro", ["P", "M", "G"], "#edcad4"),
  product("moletom-capuz", "moletons", "Moletom com Capuz", 9490, "Verde sálvia", ["4", "6", "8", "10"], "#a2af96"),
  product("moletom-lilas", "moletons", "Moletom Gola Redonda", 7990, "Lavanda", ["4", "6", "8", "10"], "#bba9d6"),
  product("conjunto-salvia", "conjuntos", "Conjunto de Algodão", 9990, "Verde sálvia", ["2", "4", "6", "8"], "#a2af96"),
  product("conjunto-caramelo", "conjuntos", "Conjunto Listrado Caramelo", 10990, "Creme e caramelo", ["2", "4", "6", "8"], "#bd9165")
];
