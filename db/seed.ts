import "dotenv/config";
import { db } from ".";
import { itemsTable } from "./schema";

const dummyBooks = [
  {
    name: "The Hobbit",
    description: "A hobbit's journey to the Lonely Mountain.",
    price: 3500,
    stock: 120,
  },
  {
    name: "The Fellowship of the Ring",
    description: "The first part of The Lord of the Rings.",
    price: 4500,
    stock: 85,
  },
  {
    name: "The Two Towers",
    description: "The second part of The Lord of the Rings.",
    price: 4500,
    stock: 92,
  },
  {
    name: "The Return of the King",
    description: "The final part of The Lord of the Rings.",
    price: 4800,
    stock: 74,
  },
  {
    name: "Dune",
    description: "Paul Atreides navigates the desert planet Arrakis.",
    price: 5500,
    stock: 45,
  },
  {
    name: "Foundation",
    description: "Hari Seldon creates the Foundation to save the galaxy.",
    price: 3800,
    stock: 8,
  }, // Low stock test!
  {
    name: "Neuromancer",
    description: "A washed-up hacker is hired for one last job.",
    price: 4200,
    stock: 33,
  },
  {
    name: "Snow Crash",
    description: "Hiro Protagonist delivers pizza and saves the Metaverse.",
    price: 3900,
    stock: 15,
  },
  {
    name: "1984",
    description: "A dystopian novel by George Orwell.",
    price: 2900,
    stock: 210,
  },
  {
    name: "Brave New World",
    description: "Aldous Huxley's vision of a genetically engineered future.",
    price: 3100,
    stock: 140,
  },
  {
    name: "Fahrenheit 451",
    description: "Guy Montag is a fireman who burns books.",
    price: 2800,
    stock: 95,
  },
  {
    name: "The Hitchhiker's Guide to the Galaxy",
    description: "Don't panic.",
    price: 4100,
    stock: 65,
  },
  {
    name: "Ender's Game",
    description: "Children train to fight an alien species.",
    price: 3600,
    stock: 110,
  },
  {
    name: "The Martian",
    description: "Mark Watney is stranded on Mars.",
    price: 4900,
    stock: 55,
  },
  {
    name: "Project Hail Mary",
    description: "A lone astronaut must save the Earth.",
    price: 5200,
    stock: 20,
  },
  {
    name: "Dark Matter",
    description: "A mind-bending thriller about parallel universes.",
    price: 4400,
    stock: 40,
  },
  {
    name: "The Three-Body Problem",
    description: "Humanity makes contact with an alien civilization.",
    price: 4700,
    stock: 78,
  },
  {
    name: "Hyperion",
    description: "Pilgrims travel to the Time Tombs.",
    price: 5100,
    stock: 25,
  },
  {
    name: "The Name of the Wind",
    description: "Kvothe tells the story of his life.",
    price: 6500,
    stock: 4,
  }, // Very low stock test!
  {
    name: "Mistborn: The Final Empire",
    description: "A thief plans to overthrow a god-emperor.",
    price: 5900,
    stock: 88,
  },
  {
    name: "The Way of Kings",
    description: "The first book of The Stormlight Archive.",
    price: 8500,
    stock: 60,
  },
  {
    name: "Leviathan Wakes",
    description: "The first book of The Expanse series.",
    price: 4600,
    stock: 105,
  },
];

async function seed() {
  console.log("Seeding database...");

  try {
    console.log(`Inserting ${dummyBooks.length} books...`);
    await db.insert(itemsTable).values(dummyBooks);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}
seed();
