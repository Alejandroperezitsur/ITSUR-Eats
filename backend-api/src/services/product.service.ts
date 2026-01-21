import { PrismaClient } from '@prisma/client';
import type { ProductDTO, CategoryDTO, CreateProductRequest, UpdateProductRequest } from '../types/index';

const prisma = new PrismaClient();

export class ProductService {
  /**
   * Crear producto
   */
  async createProduct(data: CreateProductRequest): Promise<ProductDTO> {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        stock: data.stock || 0,
        available: data.available ?? true,
        imageUrl: data.imageUrl,
      },
      include: { category: true }
    });
    return this.mapProductToDTO(product);
  }

  /**
   * Actualizar producto
   */
  async updateProduct(id: string, data: UpdateProductRequest): Promise<ProductDTO> {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
      },
      include: { category: true }
    });
    return this.mapProductToDTO(product);
  }

  /**
   * Eliminar producto (Soft delete)
   */
  async deleteProduct(id: string): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });
  }

  /**
   * Obtener todas las categorías
   */
  async getCategories(): Promise<CategoryDTO[]> {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    return categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || undefined,
      icon: cat.icon || undefined,
      displayOrder: cat.displayOrder,
    }));
  }

  /**
   * Obtener todos los productos
   */
  async getProducts(
    page = 1,
    limit = 10,
    categoryId?: string,
    search?: string
  ): Promise<any> {
    const skip = Math.max(0, (page - 1) * limit);

    const whereClause: any = {
      available: true,
      isActive: true,
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    return {
      data: products.map((prod: any) => this.mapProductToDTO(prod)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener producto por ID
   */
  async getProductById(id: string): Promise<ProductDTO | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    return product ? this.mapProductToDTO(product) : null;
  }

  /**
   * Mapear producto a DTO
   */
  private mapProductToDTO(product: any): ProductDTO {
    return {
      id: product.id,
      name: product.name,
      description: product.description || undefined,
      price: product.price.toString(),
      imageUrl: product.imageUrl || undefined,
      stock: product.stock,
      available: product.available,
      category: {
        id: product.category.id,
        name: product.category.name,
        description: product.category.description || undefined,
        icon: product.category.icon || undefined,
        displayOrder: product.category.displayOrder,
      },
      createdAt: product.createdAt,
    };
  }
}

export const productService = new ProductService();
