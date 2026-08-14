import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { requireAdmin } from '../plugins/auth.js';
import { errorResponseSchema } from '../schemas/response.schema.js';
import {
  createAuthorSchema,
  updateAuthorSchema,
  createBookSchema,
  updateBookSchema,
  createCategorySchema,
  renameCategorySchema,
} from '../schemas/admin.schema.js';
import {
  createAuthor,
  updateAuthor,
  deleteAuthor,
  createBook,
  updateBook,
  deleteBook,
  findCategoryByName,
  createCategory,
  renameCategory,
  deleteCategory,
  isCategoryInUse,
  slugify,
} from '../db/admin-queries.js';
import { NotFoundError } from '../plugins/error-handler.js';

const errorJson = zodToJsonSchema(errorResponseSchema, { $refStrategy: 'none' });

const idParamSchema = z.object({ id: z.string().uuid() });
const nameParamSchema = z.object({ name: z.string().min(1) });

export async function adminRoutes(app: FastifyInstance) {
  app.register(async (adminApp) => {
    adminApp.addHook('preHandler', requireAdmin);

    // ===== Autores =====
    adminApp.post(
      '/api/v1/admin/authors',
      {
        schema: {
          tags: ['admin'],
          summary: 'Cria um novo autor',
          body: zodToJsonSchema(createAuthorSchema, { $refStrategy: 'none' }),
          response: { 201: { type: 'object', additionalProperties: true }, 400: errorJson },
        },
      },
      async (request, reply) => {
        const data = createAuthorSchema.parse(request.body);
        const author = await createAuthor(data);
        return reply.code(201).send(author);
      },
    );

    adminApp.patch(
      '/api/v1/admin/authors/:id',
      {
        schema: {
          tags: ['admin'],
          summary: 'Atualiza um autor',
          params: zodToJsonSchema(idParamSchema, { $refStrategy: 'none' }),
          body: zodToJsonSchema(updateAuthorSchema, { $refStrategy: 'none' }),
          response: { 200: { type: 'object', additionalProperties: true }, 400: errorJson, 404: errorJson },
        },
      },
      async (request, reply) => {
        const { id } = idParamSchema.parse(request.params);
        const data = updateAuthorSchema.parse(request.body);
        const author = await updateAuthor(id, data);
        if (!author) throw new NotFoundError(`Autor '${id}'`);
        return author;
      },
    );

    adminApp.delete(
      '/api/v1/admin/authors/:id',
      {
        schema: {
          tags: ['admin'],
          summary: 'Remove um autor (e seus livros, por cascata)',
          params: zodToJsonSchema(idParamSchema, { $refStrategy: 'none' }),
          response: { 204: { type: 'null' }, 404: errorJson },
        },
      },
      async (request, reply) => {
        const { id } = idParamSchema.parse(request.params);
        await deleteAuthor(id);
        reply.code(204);
      },
    );

    // ===== Livros =====
    adminApp.post(
      '/api/v1/admin/books',
      {
        schema: {
          tags: ['admin'],
          summary: 'Cria um novo livro',
          body: zodToJsonSchema(createBookSchema, { $refStrategy: 'none' }),
          response: { 201: { type: 'object', additionalProperties: true }, 400: errorJson },
        },
      },
      async (request, reply) => {
        const data = createBookSchema.parse(request.body);
        const book = await createBook(data);
        return reply.code(201).send(book);
      },
    );

    adminApp.patch(
      '/api/v1/admin/books/:id',
      {
        schema: {
          tags: ['admin'],
          summary: 'Atualiza um livro',
          params: zodToJsonSchema(idParamSchema, { $refStrategy: 'none' }),
          body: zodToJsonSchema(updateBookSchema, { $refStrategy: 'none' }),
          response: { 200: { type: 'object', additionalProperties: true }, 400: errorJson, 404: errorJson },
        },
      },
      async (request, reply) => {
        const { id } = idParamSchema.parse(request.params);
        const data = updateBookSchema.parse(request.body);
        const book = await updateBook(id, data);
        if (!book) throw new NotFoundError(`Livro '${id}'`);
        return book;
      },
    );

    adminApp.delete(
      '/api/v1/admin/books/:id',
      {
        schema: {
          tags: ['admin'],
          summary: 'Remove um livro',
          params: zodToJsonSchema(idParamSchema, { $refStrategy: 'none' }),
          response: { 204: { type: 'null' }, 404: errorJson },
        },
      },
      async (request, reply) => {
        const { id } = idParamSchema.parse(request.params);
        await deleteBook(id);
        reply.code(204);
      },
    );

    // ===== Categorias =====
    adminApp.post(
      '/api/v1/admin/categories',
      {
        schema: {
          tags: ['admin'],
          summary: 'Registra uma categoria nova no catálogo',
          body: zodToJsonSchema(createCategorySchema, { $refStrategy: 'none' }),
          response: { 201: { type: 'object', additionalProperties: true }, 409: errorJson, 400: errorJson },
        },
      },
      async (request, reply) => {
        const data = createCategorySchema.parse(request.body);
        const existing = await findCategoryByName(data.name);
        const inUse = await isCategoryInUse(data.name);
        if (existing || inUse) {
          return reply.status(409).send({
            error: 'category_exists',
            message: `A categoria '${data.name}' já existe no catálogo`,
          });
        }
        const category = await createCategory({
          name: data.name,
          slug: data.slug || slugify(data.name),
          ...(data.description ? { description: data.description } : {}),
        });
        return reply.code(201).send(category);
      },
    );

    adminApp.patch(
      '/api/v1/admin/categories',
      {
        schema: {
          tags: ['admin'],
          summary: 'Renomeia uma categoria em todos os livros',
          body: zodToJsonSchema(renameCategorySchema, { $refStrategy: 'none' }),
          response: { 200: { type: 'object', additionalProperties: true }, 400: errorJson },
        },
      },
      async (request, reply) => {
        const { oldName, newName, description } = renameCategorySchema.parse(request.body);
        await renameCategory(oldName, newName, description);
        return { name: newName };
      },
    );

    adminApp.delete(
      '/api/v1/admin/categories/:name',
      {
        schema: {
          tags: ['admin'],
          summary: 'Remove uma categoria de todos os livros',
          params: zodToJsonSchema(nameParamSchema, { $refStrategy: 'none' }),
          response: { 204: { type: 'null' }, 404: errorJson },
        },
      },
      async (request, reply) => {
        const { name } = nameParamSchema.parse(request.params);
        if (!(await isCategoryInUse(name)) && !(await findCategoryByName(name))) {
          throw new NotFoundError(`Categoria '${name}'`);
        }
        await deleteCategory(name);
        reply.code(204);
      },
    );
  });
}
