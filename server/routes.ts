import type { Express } from "express";
import { storage } from "./storage.js";
import { generateArticleContent } from "./gemini.js";
import { insertArticleSchema, updateArticleSchema } from "../shared/schema.js";
import slugify from "slugify";

export async function registerRoutes(app: Express): Promise<void> {
  // Get all articles
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // Get article by slug
  app.get("/api/articles/slug/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // Get article by ID
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // Generate article with AI
  app.post("/api/articles/generate", async (req, res) => {
    try {
      const { title } = req.body;
      
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: "Title is required" });
      }

      console.log(`Generating article for title: ${title}`);
      
      // Generate content with Gemini
      const { content, excerpt } = await generateArticleContent(title);
      
      // Generate unique slug
      let slug = slugify(title, { lower: true, strict: true });
      let slugSuffix = 0;
      let finalSlug = slug;
      
      while (await storage.getArticleBySlug(finalSlug)) {
        slugSuffix++;
        finalSlug = `${slug}-${slugSuffix}`;
      }
      
      // Create article
      const article = await storage.createArticle({
        title,
        slug: finalSlug,
        content,
        excerpt,
        status: 'draft',
        featuredImage: null,
        publishedAt: null,
      });
      
      console.log(`Article created successfully: ${article.id}`);
      res.json(article);
    } catch (error: any) {
      console.error("Error generating article:", error);
      res.status(500).json({ 
        error: "Failed to generate article",
        message: error.message 
      });
    }
  });

  // Create article manually
  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      
      // Generate slug if not provided
      if (!validatedData.slug) {
        let slug = slugify(validatedData.title, { lower: true, strict: true });
        let slugSuffix = 0;
        let finalSlug = slug;
        
        while (await storage.getArticleBySlug(finalSlug)) {
          slugSuffix++;
          finalSlug = `${slug}-${slugSuffix}`;
        }
        
        validatedData.slug = finalSlug;
      }
      
      const article = await storage.createArticle(validatedData);
      res.json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(400).json({ error: "Invalid article data" });
    }
  });

  // Update article
  app.patch("/api/articles/:id", async (req, res) => {
    try {
      const validatedData = updateArticleSchema.parse(req.body);
      
      // Convert ISO string dates to Date objects for Drizzle
      if (validatedData.publishedAt && typeof validatedData.publishedAt === 'string') {
        validatedData.publishedAt = new Date(validatedData.publishedAt);
      }
      
      const article = await storage.updateArticle(req.params.id, validatedData);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Delete article
  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const success = await storage.deleteArticle(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Get article stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getArticleStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  return;
}
