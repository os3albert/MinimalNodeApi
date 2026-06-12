import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import CodeError from "./../constants/codeError.js"

// con type:"module" __dirname non esiste: va ricavato da import.meta.url
console.log(path.dirname(fileURLToPath(import.meta.url)));
// recupero la directory dove viene invocato lo script
// in questo caso ~/front-end-everydayproject/backend/helpers
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getProductData = async () => {
  try {
    const products = await fs.readFile(
      path.join(__dirname, "..", "data", "prodotti.json"),
      "utf8",
    );
    const productsObj = JSON.parse(products);
    return productsObj;
  } catch (error) {
    console.error(`Problem Fetching Data: ${error.message}`);
  }
};

// se questa riga la metto prima che venga creato il metodo getProductData() viene generato un errore
// da capire se conviene fare in questo modo o usare invece function che permette l'oisting
const products = await getProductData();

const ProductService = {
  getProducts: async () => {
    return products;
  },
  getProductById: (id) => {
    const findedProduct = products.find((prod)=>prod.id == parseInt(id));
    if (findedProduct == undefined){
      throw new Error(JSON.stringify(CodeError.PRODUCT_NOT_FOUND));
    }
    return findedProduct;
  },
};

export { ProductService };
