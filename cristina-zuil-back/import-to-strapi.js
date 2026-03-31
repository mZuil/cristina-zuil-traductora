// ============================================================
//  Strapi Import Script — Translation Books
//  Usage: node import-to-strapi.js
//  Requirements: node-fetch  →  npm install node-fetch
// ============================================================

import fetch from "node-fetch";

// ── CONFIG ────────────────────────────────────────────────────
const STRAPI_URL = "http://localhost:1337";
const API_TOKEN = "847882d2c22c1d02d6015f7c0e75b929559932cca5d45eaa8f991b1fef8befc87419d3b82646c2cffbc047f51e7882bf63b35b0e905c6e48a9a7ec2950fbc5df20f3e5341f22aacaf5ece67922b07b3660c619464561ade24af4f5fe57e74967d3f7fe31eaebe3d86572a2db92522605c4b99a4e8cfcdcdf6c8df058a1fef581";    // Settings > API Tokens
// ─────────────────────────────────────────────────────────────

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_TOKEN}`,
};

// ── RAW DATA ──────────────────────────────────────────────────
const books = [
  { title: "Franco. Unidos en la distancia", author: "Kim Holden", year: 2018, genres: ["Romántica"], link: "https://ozeditorial.com/index.php?id_product=92&controller=product" },
  { title: "La amiga", author: "Teresa Driscoll", year: 2019, genres: ["Novela negra"], link: "https://principaldeloslibros.com/index.php?id_product=210&controller=product" },
  { title: "Transformacion exponencial", author: "Francisco Palao, Michelle Lapierre y Salim Ismail", year: 2019, genres: ["Empresarial"], link: "https://www.bubok.es/libros/260962/Transformacion-exponencial" },
  { title: "Rutina diaria de yoga", author: "Maurizio Morelli", year: 2020, genres: ["Manual de yoga"], link: "http://www.edimat.es/edimat_libros.php?codigoISBN=9788497944977&categoria=Divulgaci%C3%B3n" },
  { title: "Técnicas de respiración en el yoga", author: "Maurizio Morelli", year: 2020, genres: ["Manual de yoga"], link: "http://www.edimat.es/edimat_libros.php?codigoISBN=9788497944984&categoria=Divulgaci%C3%B3n" },
  { title: "El método pilates", author: "Anna Maria Cova", year: 2020, genres: ["Manual de pilates"], link: "http://www.edimat.es/edimat_libros.php?codigoISBN=9788497944991&categoria=Divulgaci%C3%B3n" },
  { title: "La naturaleza en el yoga", author: "Sonia Pippinato", year: 2020, genres: ["Manual de yoga"], link: "http://www.edimat.es/edimat_libros.php?codigoISBN=9788497944960&categoria=Divulgaci%C3%B3n" },
  { title: "Asesinato en el campo de golf", author: "Agatha Christie", year: 2020, genres: ["Novela negra", "Clásico"], link: "https://www.bubok.es/libros/265837/Asesinato-en-el-campo-de-golf-Edicion-en-letra-grande" },
  { title: "El hombre del traje marrón", author: "Agatha Christie", year: 2020, genres: ["Novela negra", "Clásico"], link: "https://www.bubok.es/libros/264579/El-hombre-del-traje-marron-Edicion-en-letra-grande" },
  { title: "El maravilloso viaje subterráneo de Baron Trump", author: "Ingersoll Lockwood", year: 2020, genres: ["Juvenil", "Clásico", "Aventuras"], link: "https://laisladesiltola.es/catalogo/narrativa/el-maravilloso-viaje-subterraneo-de-baron-trump/" },
  { title: "Érase una vez... ¡la música!", author: "Paola Venturi", year: 2021, genres: ["Juvenil", "Infantil"], link: "https://redbookediciones.com/producto/musica/erase-una-vez-la-musica/" },
  { title: "Tierra de clanes", author: "Sam Heughan, Graham McTavish", year: 2021, genres: ["No ficción", "Viajes"], link: "https://principaldeloslibros.com/index.php?id_product=248&controller=product" },
  { title: "Un hombre llamado Muñeca", author: "Jonathan Ames", year: 2021, genres: ["Novela negra"], link: "https://principaldeloslibros.com/index.php?id_product=257&controller=product" },
  { title: "Juvenilia", author: "Jane Austen", year: 2021, genres: ["Romántica", "Clásico"], link: "https://www.edimat.es/edimat_libros.php?codigoISBN=9788497945189&categoria=Literatura" },
  { title: "Lady Susan/Los Watson", author: "Jane Austen", year: 2021, genres: ["Romántica", "Clásico"], link: "https://www.edimat.es/edimat_libros.php?codigoISBN=9788497945196&categoria=Literatura" },
  { title: "Tal vez somos eléctricos", author: "Val Emmich", year: 2021, genres: ["Romántica", "Young adult"], link: "https://wonderbooks.es/inicio/8-tal-vez-somo-electricos.html" },
  { title: "Tierra de clanes. El almanaque", author: "Sam Heughan, Graham McTavish", year: 2021, genres: ["No ficción", "Viajes"], link: "https://principaldeloslibros.com/index.php?id_product=263&controller=product" },
  { title: "Sentido y sensibilidad", author: "Jane Austen", year: 2021, genres: ["Romántica", "Clásico"], link: "https://suscripciones.zinetmedia.es/mz/femeninas/mia/mia-1842-sentidosensibilidad" },
  { title: "Agnes Grey", author: "Anne Brontë", year: 2021, genres: ["Romántica", "Clásico"], link: "https://suscripciones.zinetmedia.es/mz/femeninas/mia/mia-1833-agnesgrey" },
  { title: "El creador de sueños", author: "Igor Bedê", year: 2021, genres: ["Ciencia ficción"], link: "https://www.amazon.es/El-Creador-Sue%C3%B1os-Igor-Bed%C3%AA/dp/B09NH3V7SW" },
  { title: "Perro malo", author: "Alex Smith", year: 2022, genres: ["Novela negra"], link: "https://principaldeloslibros.com/index.php?id_product=279&controller=product" },
  { title: "La calavera de cristal", author: "Eleonora Barsotti", year: 2022, genres: ["Infantil"], link: "https://www.edimat.es/estudio_didactico.php?codigoISBN=9788497869584&categoria=Interactivos" },
  { title: "El robo del Louvre", author: "Eleonora Barsotti", year: 2022, genres: ["Infantil"], link: "https://www.edimat.es/estudio_didactico.php?codigoISBN=9788497869577&categoria=Interactivos" },
  { title: "Dioses despiadados", author: "Emily A. Duncan", year: 2022, genres: ["Juvenil", "Fantasía"], link: "https://www.editorialhidra.com/libro/dioses-despiadados_136374/" },
  { title: "Coronas gemelas", author: "Catherine Doyle, Katherine Webber", year: 2022, genres: ["Juvenil", "Fantasía"], link: "https://www.editorialhidra.com/libro/coronas-gemelas_142355/" },
  { title: "El otro lado del cielo", author: "Amie Kaufman, Meagan Spooner", year: 2023, genres: ["Juvenil", "Fantasía", "Ciencia ficción"], link: "https://www.editorialhidra.com/libro/el-otro-lado-del-cielo_136357/" },
  { title: "Benditos monstruos", author: "Emily A. Duncan", year: 2023, genres: ["Juvenil", "Fantasía"], link: "https://www.editorialhidra.com/libro/benditos-monstruos_145772/" },
  { title: "Waypoints. Mi viaje escocés", author: "Sam Heughan", year: 2023, genres: ["No ficción", "Viajes"], link: "https://principaldeloslibros.com/index.php?id_product=299&controller=product" },
  { title: "Los luminarios", author: "Susan Dennard", year: 2023, genres: ["Juvenil", "Fantasía"], link: "https://www.editorialhidra.com/libro/los-luminarios_145803/" },
  { title: "Más allá del fin del mundo", author: "Amie Kaufman, Meagan Spooner", year: 2023, genres: ["Juvenil", "Fantasía", "Ciencia ficción"], link: "https://www.editorialhidra.com/libro/mas-alla-del-fin-del-mundo_145774/" },
  { title: "¿Cómo hacer enfadar a mamá y a papá?", author: "Gabriella Ballin, Anna Aparicio Catalá", year: 2023, genres: ["Infantil"], link: "https://www.picarona.net/producto/como-hacer-enfadar-a-mama-y-a-papa/" },
  { title: "Mujercitas", author: "Louisa May Alcott, Elisa Delucchi", year: 2023, genres: ["Infantil", "Clásico"], link: "https://www.picarona.net/producto/mujercitas/" },
  { title: "Alicia en el País de las Maravillas", author: "Lewis Carroll, Elisa Delucchi", year: 2023, genres: ["Infantil", "Clásico"], link: "https://www.picarona.net/producto/alicia-en-el-pais-de-las-maravillas/" },
  { title: "Coronas malditas", author: "Catherine Doyle, Katherine Webber", year: 2023, genres: ["Juvenil", "Fantasía"], link: "https://www.editorialhidra.com/libro/coronas-malditas_148062/" },
  { title: "Dublineses + Retrato del artista adolescente", author: "James Joyce", year: 2023, genres: ["Clásico"], link: "https://www.edimat.es/edimat_libros.php?codigoISBN=9788497945547&categoria=Literatura" },
  { title: "Marcada por las estrellas", author: "Roshani Chokshi", year: 2023, genres: ["Juvenil", "Fantasía"], link: "https://www.editorialhidra.com/libro/marcada-por-las-estrellas_148110/" },
  { title: "La magia del gato", author: "Alessandro Montagnana", year: 2023, genres: ["Infantil"], link: "https://www.picarona.net/producto/la-magia-del-gato/" },
  { title: "Colmillo blanco", author: "Jack London, Elisa Delucchi", year: 2023, genres: ["Infantil", "Clásico"], link: "https://www.picarona.net/producto/colmillo-blanco/" },
  { title: "Pinocho", author: "Carlo Collodi, Elisa Delucchi", year: 2023, genres: ["Infantil", "Clásico"], link: "https://www.picarona.net/producto/pinocho/" },
  { title: "Prácticas empoderadoras para las personas altamente sensibles", author: "Bertold Keinar", year: 2023, genres: ["No ficción", "Psicología"], link: "https://www.edicionesobelisco.com/libros-de-psicologia/3743-practicas-empoderadoras-para-las-personas-altamente-sensibles.html" },
  { title: "Una corona de deseos", author: "Roshani Chokshi", year: 2024, genres: ["Fantasía"], link: "https://www.editorialhidra.com/libro/una-corona-de-deseos_150315/" },
  { title: "Merlín moderno", author: "Lon Art", year: 2024, genres: ["No ficción", "Esoterismo"], link: "https://www.edicionesobelisco.com/libros-de-esoterismo/3774-merlin-moderno.html" },
  { title: "La luna del cazador", author: "Susan Dennard", year: 2024, genres: ["Juvenil", "Fantasía"], link: "https://www.editorialhidra.com/libro/la-luna-del-cazador_150317/" },
  { title: "Los piratas cuatropatas - Una vida muy perra", author: "Jack Henseleit, Chris Kennet", year: 2024, genres: ["Infantil"], link: "https://www.penguinlibros.com/es/libros-ninos-7-anos/343309-ebook-los-piratas-cuatropatas-1-una-vida-muy-perra-9788419910318" },
  { title: "Faebound", author: "Saara El-Arifi", year: 2024, genres: ["Fantasía"], link: null },
  { title: "El diario de Phoebe", author: "Phoebe Wahl", year: 2024, genres: ["Juvenil"], link: "https://www.editorialhidra.com/libro/el-diario-de-phoebe_150312/" },
  { title: "Fábulas de Esopo", author: "Esopo", year: 2024, genres: ["Clásico"], link: "https://www.qproquo.com/es/libro/fabulas-ilustradas-de-esopo_M770670051" },
];

// ── HELPERS ───────────────────────────────────────────────────
async function fetchAllGenres() {
  const res = await fetch(`${STRAPI_URL}/api/genres?pagination[pageSize]=100`, { headers });
  const json = await res.json();
  if (!res.ok) throw new Error(`Failed to fetch genres: ${JSON.stringify(json)}`);
  // Returns a map: { "Romántica": 3, "Clásico": 7, ... }
  return Object.fromEntries(
    (json.data ?? []).map((g) => {
      const name = g?.attributes?.name ?? g?.name;
      if (!name) {
        throw new Error(
          `Unexpected genre shape from Strapi. Missing name field. Item: ${JSON.stringify(g)}`
        );
      }
      return [name, g.id];
    })
  );
}

async function createBook(payload) {
  const res = await fetch(`${STRAPI_URL}/api/books`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data: payload }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Failed to create "${payload.title}": ${JSON.stringify(json.error)}`);
  return json.data;
}

// ── MAIN ──────────────────────────────────────────────────────
async function main() {
  console.log("🔍 Fetching genres from Strapi...");
  const genreMap = await fetchAllGenres();
  console.log(`   Found genres: ${Object.keys(genreMap).join(", ")}\n`);

  let created = 0;
  let failed = 0;

  for (const book of books) {
    // Resolve genre IDs — warn but skip unknown genres
    const genreIds = [];
    for (const g of book.genres) {
      if (genreMap[g] !== undefined) {
        genreIds.push(genreMap[g]);
      } else {
        console.warn(`   ⚠️  Genre "${g}" not found in Strapi, skipping for "${book.title}"`);
      }
    }

    const payload = {
      title: book.title,
      author: book.author,
      year: book.year,
      genres: genreIds,           // relation → array of IDs
      bookCategory: "traduccion",
      ...(book.link && {
        link: {
          label: book.title,      // using title as label — adjust if you prefer something else
          url: book.link,
          is_external: true,
        },
      }),
    };

    try {
      await createBook(payload);
      console.log(`✅ Created: ${book.title}`);
      created++;
    } catch (err) {
      console.error(`❌ Failed: ${book.title} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n── Done ──────────────────────────────`);
  console.log(`   Created : ${created}`);
  console.log(`   Failed  : ${failed}`);
  console.log(`   Total   : ${books.length}`);
}

main().catch((err) => {
  const details = {
    message: err?.message,
    name: err?.name,
    type: err?.type,
    code: err?.code,
    errno: err?.errno,
    syscall: err?.syscall,
    address: err?.address,
    port: err?.port,
    cause: {
      message: err?.cause?.message,
      code: err?.cause?.code,
      errno: err?.cause?.errno,
      syscall: err?.cause?.syscall,
      address: err?.cause?.address,
      port: err?.cause?.port,
    },
  };

  console.error("Fatal error:");
  console.error(details);
  process.exit(1);
});