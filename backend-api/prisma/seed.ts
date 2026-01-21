import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Crear categorías
  const cappuccinoCategory = await prisma.category.create({
    data: {
      name: 'Cafés',
      description: 'Bebidas de café especializadas',
      icon: '☕',
      displayOrder: 1,
    },
  });

  const breakfastCategory = await prisma.category.create({
    data: {
      name: 'Desayunos',
      description: 'Opciones de desayuno',
      icon: '🥐',
      displayOrder: 2,
    },
  });

  const dessertCategory = await prisma.category.create({
    data: {
      name: 'Postres',
      description: 'Postres y dulces',
      icon: '🍰',
      displayOrder: 3,
    },
  });

  // Crear productos
  await prisma.product.createMany({
    data: [
      {
        name: 'Cappuccino',
        description: 'Espresso con leche vaporizada',
        price: 3.50,
        imageUrl: 'https://via.placeholder.com/300x300?text=Cappuccino',
        stock: 50,
        available: true,
        categoryId: cappuccinoCategory.id,
      },
      {
        name: 'Americano',
        description: 'Espresso diluido en agua caliente',
        price: 2.50,
        imageUrl: 'https://via.placeholder.com/300x300?text=Americano',
        stock: 50,
        available: true,
        categoryId: cappuccinoCategory.id,
      },
      {
        name: 'Latte',
        description: 'Espresso con mucha leche',
        price: 4.00,
        imageUrl: 'https://via.placeholder.com/300x300?text=Latte',
        stock: 50,
        available: true,
        categoryId: cappuccinoCategory.id,
      },
      {
        name: 'Pan Dulce',
        description: 'Pan dulce casero',
        price: 1.50,
        imageUrl: 'https://via.placeholder.com/300x300?text=Pan+Dulce',
        stock: 30,
        available: true,
        categoryId: breakfastCategory.id,
      },
      {
        name: 'Huevos Revueltos',
        description: 'Huevos revueltos con pan tostado',
        price: 3.00,
        imageUrl: 'https://via.placeholder.com/300x300?text=Huevos',
        stock: 20,
        available: true,
        categoryId: breakfastCategory.id,
      },
      {
        name: 'Brownie',
        description: 'Brownie de chocolate',
        price: 2.00,
        imageUrl: 'https://via.placeholder.com/300x300?text=Brownie',
        stock: 25,
        available: true,
        categoryId: dessertCategory.id,
      },
      {
        name: 'Cheesecake',
        description: 'Porción de cheesecake clásico',
        price: 3.50,
        imageUrl: 'https://via.placeholder.com/300x300?text=Cheesecake',
        stock: 15,
        available: true,
        categoryId: dessertCategory.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
