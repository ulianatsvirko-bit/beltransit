import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(path.join(root, "src/main.jsx"), "utf8");

const faqRoutes = {
  "/sbornye-gruzy/": "groupageFaq",
  "/vykup-tovarov/": "buyoutFaq",
  "/tamozhnoe-oformlenie/": "customsFaq",
  "/dlya-logistov/": "partnerFaq",
  "/sklad-vilnyus/": "warehouseFaq",
  "/sankcionnye-gruzy/": "sanctionsFaq",
  "/stoimost-dostavki/": "pricingFaq",
  "/kerhery-i-moyki/": "washerFaq",
  "/shiny-i-avtozapchasti/": "tireFaq",
  "/bytovaya-tehnika/": "applianceFaq",
  "/poisk-postavshchika/": "supplierSearchFaq",
  "/mebel-iz-evropy/": "furnitureFaq",
};

function arrayLiteral(name) {
  const declaration = `const ${name} = `;
  const declarationIndex = source.indexOf(declaration);
  if (declarationIndex === -1) throw new Error(`FAQ source ${name} was not found`);
  const start = source.indexOf("[", declarationIndex + declaration.length);
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") quote = character;
    else if (character === "[") depth += 1;
    else if (character === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error(`FAQ source ${name} is not a complete array`);
}

const routeFaqs = Object.fromEntries(
  Object.entries(faqRoutes).map(([route, variable]) => [
    route,
    vm.runInNewContext(`(${arrayLiteral(variable)})`, Object.create(null), { timeout: 1000 }),
  ]),
);
const generalFaqLiteral = arrayLiteral("generalFaqCategories")
  .replace(/\bicon:\s*[A-Za-z0-9_]+\s*,/g, "");
const generalFaq = vm.runInNewContext(`(${generalFaqLiteral})`, Object.create(null), { timeout: 1000 });
routeFaqs["/faq/"] = generalFaq.flatMap((category) => category.questions || []);

const output = `// Generated from visible FAQ arrays in src/main.jsx. Do not edit manually.\nexport const ROUTE_FAQS = ${JSON.stringify(routeFaqs, null, 2)};\n`;
await writeFile(path.join(root, "lib/generated-faq-data.js"), output);
console.log(`Generated FAQ schema data for ${Object.keys(routeFaqs).length} routes.`);
