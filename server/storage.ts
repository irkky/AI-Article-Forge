import { articles, type Article, type InsertArticle, type UpdateArticle } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getAllArticles(): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getPublishedArticles(): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, updates: UpdateArticle): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  getArticleStats(): Promise<{
    total: number;
    published: number;
    drafts: number;
    thisWeek: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getAllArticles(): Promise<Article[]> {
    return await db.select().from(articles).orderBy(desc(articles.createdAt));
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article || undefined;
  }

  async getPublishedArticles(): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.status, 'published'))
      .orderBy(desc(articles.publishedAt));
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async updateArticle(id: string, updates: UpdateArticle): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set(updates)
      .where(eq(articles.id, id))
      .returning();
    return article || undefined;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getArticleStats(): Promise<{
    total: number;
    published: number;
    drafts: number;
    thisWeek: number;
  }> {
    const allArticles = await this.getAllArticles();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      total: allArticles.length,
      published: allArticles.filter(a => a.status === 'published').length,
      drafts: allArticles.filter(a => a.status === 'draft').length,
      thisWeek: allArticles.filter(a => new Date(a.createdAt) > weekAgo).length,
    };
  }
}

export const storage = new DatabaseStorage();
