import path from 'node:path';
import os from 'node:os';
import { Product, Category, Marketplace, HeroSlide, Click, User, FilterOptions } from './types';

// Safely attempt to load node:sqlite
let DatabaseSyncClass: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sqliteModule = require('node:sqlite');
  DatabaseSyncClass = sqliteModule.DatabaseSync;
} catch {
  DatabaseSyncClass = null;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_men', name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80' },
  { id: 'cat_women', name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80' },
  { id: 'cat_kids', name: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80' },
  { id: 'cat_streetwear', name: 'Streetwear', slug: 'streetwear', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80' },
  { id: 'cat_genz', name: 'Gen Z', slug: 'gen-z', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80' },
  { id: 'cat_korean', name: 'Korean', slug: 'korean', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80' },
  { id: 'cat_tshirts', name: 'T-Shirts', slug: 't-shirts', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80' },
  { id: 'cat_hoodies', name: 'Hoodies', slug: 'hoodies', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80' },
  { id: 'cat_jackets', name: 'Jackets', slug: 'jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80' },
  { id: 'cat_jeans', name: 'Jeans', slug: 'jeans', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80' },
  { id: 'cat_shoes', name: 'Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80' },
  { id: 'cat_shirts', name: 'Shirts', slug: 'shirts', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80' }
];

const DEFAULT_MARKETPLACES: Marketplace[] = [
  { id: 'mp_amazon', name: 'Amazon', slug: 'amazon', logo: 'https://images.unsplash.com/photo-1523474255658-4af61b1614ff?w=120&h=120&fit=crop', website: 'https://www.amazon.in' },
  { id: 'mp_myntra', name: 'Myntra', slug: 'myntra', logo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=120&fit=crop', website: 'https://www.myntra.com' },
  { id: 'mp_meesho', name: 'Meesho', slug: 'meesho', logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop', website: 'https://www.meesho.com' },
  { id: 'mp_shopsy', name: 'Shopsy', slug: 'shopsy', logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=120&h=120&fit=crop', website: 'https://www.shopsy.in' }
];

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide_1',
    title: 'LOOK EXPENSIVE.\nPAY LESS.',
    subtitle: 'The best fashion deals from your favorite stores, all in one place.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=2560&auto=format&fit=crop&q=95',
    button_text: 'EXPLORE DEALS',
    button_url: '/deals',
    theme: 'orange',
    display_order: 1,
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'slide_2',
    title: 'UP TO 80% OFF\nON STYLE.',
    subtitle: 'Discover the latest clothing and apparel offers curated daily.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2560&auto=format&fit=crop&q=95',
    button_text: 'SHOP NOW',
    button_url: '/deals?sort=discount',
    theme: 'dark',
    display_order: 2,
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'slide_3',
    title: 'TARZER PICKS.\nLOWEST PRICES.',
    subtitle: 'Find fashion worth buying without wasting hours searching.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=2560&auto=format&fit=crop&q=95',
    button_text: 'VIEW OFFERS',
    button_url: '/deals?badge=TARZER+PICK',
    theme: 'light',
    display_order: 3,
    active: true,
    created_at: new Date().toISOString()
  }
];

class TarzerDatabase {
  private db: any = null;
  private isMemoryFallback = false;

  // In-memory resilient storage
  private memCategories: Category[] = [...DEFAULT_CATEGORIES];
  private memMarketplaces: Marketplace[] = [...DEFAULT_MARKETPLACES];
  private memHeroSlides: HeroSlide[] = [...DEFAULT_HERO_SLIDES];
  private memProducts: Product[] = [];
  private memSettings: Record<string, string> = { building_mode: 'true' };
  private memClicks: Click[] = [];

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (!DatabaseSyncClass) {
      console.warn('[Tarzer DB] node:sqlite is not available in this Node runtime. Operating in resilient in-memory mode.');
      this.isMemoryFallback = true;
      return;
    }

    const isServerless = Boolean(
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.VERCEL_ENV
    );

    // On Vercel / Serverless, process.cwd() is read-only (/var/task). Only os.tmpdir() (/tmp) is writable.
    const targetPath = isServerless ? path.join(os.tmpdir(), 'tarzer.db') : path.join(process.cwd(), 'tarzer.db');

    try {
      this.db = new DatabaseSyncClass(targetPath);
      this.initTables(isServerless);
      this.seedDefaultsIfEmpty();
    } catch (fileErr) {
      console.warn(`[Tarzer DB] Could not write to ${targetPath}. Falling back to in-memory SQLite:`, fileErr);
      try {
        this.db = new DatabaseSyncClass(':memory:');
        this.initTables(true);
        this.seedDefaultsIfEmpty();
      } catch (memErr) {
        console.warn('[Tarzer DB] In-memory SQLite failed. Falling back to native JS storage:', memErr);
        this.isMemoryFallback = true;
      }
    }
  }

  private initTables(isServerless = false) {
    if (!this.db) return;
    try {
      if (isServerless) {
        this.db.exec('PRAGMA journal_mode = MEMORY;');
      } else {
        this.db.exec('PRAGMA journal_mode = WAL;');
      }
    } catch {
      // PRAGMA journal_mode not always applicable in memory
    }

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'ADMIN',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS marketplaces (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        logo TEXT NOT NULL,
        website TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        image TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        current_price REAL NOT NULL,
        original_price REAL NOT NULL,
        discount_percentage INTEGER NOT NULL,
        marketplace_id TEXT,
        category_id TEXT,
        affiliate_url TEXT NOT NULL,
        image_url TEXT NOT NULL,
        badge TEXT DEFAULT 'HOT DEAL',
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        featured INTEGER NOT NULL DEFAULT 0,
        sizes TEXT DEFAULT 'S, M, L, XL',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (marketplace_id) REFERENCES marketplaces(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS product_images (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        image_url TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS hero_slides (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        image TEXT NOT NULL,
        button_text TEXT NOT NULL DEFAULT 'EXPLORE DEALS',
        button_url TEXT NOT NULL DEFAULT '/deals',
        theme TEXT NOT NULL DEFAULT 'orange',
        display_order INTEGER NOT NULL DEFAULT 0,
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS clicks (
        id TEXT PRIMARY KEY,
        product_id TEXT,
        marketplace_id TEXT,
        referrer TEXT,
        clicked_at TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
        FOREIGN KEY (marketplace_id) REFERENCES marketplaces(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  }

  private seedDefaultsIfEmpty() {
    if (!this.db) return;
    try {
      const userCount = (this.db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
      if (userCount === 0) {
        this.seedData();
        return;
      }

      const insertCat = this.db.prepare(`
        INSERT OR IGNORE INTO categories (id, name, slug, image, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);
      const now = new Date().toISOString();
      for (const cat of DEFAULT_CATEGORIES) {
        insertCat.run(cat.id, cat.name, cat.slug, cat.image, now);
      }
    } catch (err) {
      console.warn('[Tarzer DB] Seed defaults error:', err);
    }
  }

  public seedData() {
    const now = new Date().toISOString();

    if (!this.db) return;

    try {
      // 1. Admin User
      const insertUser = this.db.prepare(`
        INSERT OR REPLACE INTO users (id, email, password_hash, role, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);
      insertUser.run('u_admin_1', 'admin@tarzer.in', 'tarzeradmin123', 'ADMIN', now);

      // 2. Marketplaces
      const insertMp = this.db.prepare(`
        INSERT OR REPLACE INTO marketplaces (id, name, slug, logo, website, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      for (const mp of DEFAULT_MARKETPLACES) {
        insertMp.run(mp.id, mp.name, mp.slug, mp.logo, mp.website, now);
      }

      // 3. Categories
      const insertCat = this.db.prepare(`
        INSERT OR REPLACE INTO categories (id, name, slug, image, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const cat of DEFAULT_CATEGORIES) {
        insertCat.run(cat.id, cat.name, cat.slug, cat.image, now);
      }

      // 4. Hero Slides
      const insertSlide = this.db.prepare(`
        INSERT OR REPLACE INTO hero_slides (id, title, subtitle, image, button_text, button_url, theme, display_order, active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const slide of DEFAULT_HERO_SLIDES) {
        insertSlide.run(slide.id, slide.title, slide.subtitle, slide.image, slide.button_text, slide.button_url, slide.theme, slide.display_order, slide.active ? 1 : 0, now);
      }

      // 5. Default System Settings
      const insertSetting = this.db.prepare(`
        INSERT OR IGNORE INTO system_settings (key, value)
        VALUES (?, ?)
      `);
      insertSetting.run('building_mode', 'true');
    } catch (err) {
      console.warn('[Tarzer DB] Seed data error:', err);
    }
  }

  public clearAllMockProducts(): void {
    if (this.db) {
      try {
        this.db.exec(`
          DELETE FROM product_images;
          DELETE FROM clicks;
          DELETE FROM products;
        `);
      } catch (err) {
        console.error('Failed to clear mock products:', err);
      }
    }
    this.memProducts = [];
    this.memClicks = [];
  }

  private toPlain<T>(data: T): T {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
  }

  // ================= PRODUCTS CRUD =================
  public getProducts(filters?: FilterOptions): Product[] {
    if (this.isMemoryFallback || !this.db) {
      let list = [...this.memProducts];
      if (filters?.status) {
        list = list.filter((p) => p.status === filters.status);
      } else {
        list = list.filter((p) => p.status === 'ACTIVE');
      }
      if (filters?.category) {
        list = list.filter((p) => p.category_id === filters.category || p.category?.slug === filters.category);
      }
      if (filters?.marketplace) {
        list = list.filter((p) => p.marketplace_id === filters.marketplace || p.marketplace?.slug === filters.marketplace);
      }
      if (filters?.minPrice !== undefined) {
        list = list.filter((p) => p.current_price >= (filters.minPrice || 0));
      }
      if (filters?.maxPrice !== undefined) {
        list = list.filter((p) => p.current_price <= (filters.maxPrice || Infinity));
      }
      if (filters?.minDiscount !== undefined) {
        list = list.filter((p) => p.discount_percentage >= (filters.minDiscount || 0));
      }
      if (filters?.featured !== undefined) {
        list = list.filter((p) => Boolean(p.featured) === filters.featured);
      }
      if (filters?.q) {
        const q = filters.q.toLowerCase();
        list = list.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (filters?.sort === 'discount') {
        list.sort((a, b) => b.discount_percentage - a.discount_percentage);
      } else if (filters?.sort === 'price-low') {
        list.sort((a, b) => a.current_price - b.current_price);
      } else if (filters?.sort === 'price-high') {
        list.sort((a, b) => b.current_price - a.current_price);
      }
      return this.toPlain(list);
    }

    try {
      let sql = `
        SELECT p.*, 
          m.name as marketplace_name, m.slug as marketplace_slug, m.logo as marketplace_logo, m.website as marketplace_website,
          c.name as category_name, c.slug as category_slug, c.image as category_image,
          (SELECT COUNT(*) FROM clicks WHERE product_id = p.id) as clicks_count
        FROM products p
        LEFT JOIN marketplaces m ON p.marketplace_id = m.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 1=1
      `;
      const params: (string | number)[] = [];

      if (filters?.status) {
        sql += ' AND p.status = ?';
        params.push(filters.status);
      } else {
        sql += " AND p.status = 'ACTIVE'";
      }

      if (filters?.category) {
        sql += ' AND (c.slug = ? OR c.id = ?)';
        params.push(filters.category, filters.category);
      }

      if (filters?.marketplace) {
        sql += ' AND (m.slug = ? OR m.id = ?)';
        params.push(filters.marketplace, filters.marketplace);
      }

      if (filters?.minPrice !== undefined) {
        sql += ' AND p.current_price >= ?';
        params.push(filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        sql += ' AND p.current_price <= ?';
        params.push(filters.maxPrice);
      }

      if (filters?.minDiscount !== undefined) {
        sql += ' AND p.discount_percentage >= ?';
        params.push(filters.minDiscount);
      }

      if (filters?.featured !== undefined) {
        sql += ' AND p.featured = ?';
        params.push(filters.featured ? 1 : 0);
      }

      if (filters?.q) {
        sql += ' AND (p.title LIKE ? OR p.description LIKE ? OR c.name LIKE ? OR m.name LIKE ?)';
        const term = `%${filters.q}%`;
        params.push(term, term, term, term);
      }

      if (filters?.sort === 'discount') {
        sql += ' ORDER BY p.discount_percentage DESC, p.created_at DESC';
      } else if (filters?.sort === 'price-low') {
        sql += ' ORDER BY p.current_price ASC';
      } else if (filters?.sort === 'price-high') {
        sql += ' ORDER BY p.current_price DESC';
      } else if (filters?.sort === 'trending') {
        sql += ' ORDER BY clicks_count DESC, p.discount_percentage DESC';
      } else {
        sql += ' ORDER BY p.created_at DESC';
      }

      const rows = this.db.prepare(sql).all(...params) as any[];
      return this.toPlain(rows.map((r) => this.formatProduct(r)));
    } catch (err) {
      console.warn('[Tarzer DB] getProducts error, using memory fallback:', err);
      return this.toPlain(this.memProducts);
    }
  }

  public getProductBySlug(slug: string): Product | null {
    if (this.isMemoryFallback || !this.db) {
      const prod = this.memProducts.find((p) => p.slug === slug);
      return prod ? this.toPlain(prod) : null;
    }

    try {
      const sql = `
        SELECT p.*, 
          m.name as marketplace_name, m.slug as marketplace_slug, m.logo as marketplace_logo, m.website as marketplace_website,
          c.name as category_name, c.slug as category_slug, c.image as category_image,
          (SELECT COUNT(*) FROM clicks WHERE product_id = p.id) as clicks_count
        FROM products p
        LEFT JOIN marketplaces m ON p.marketplace_id = m.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.slug = ?
      `;
      const row = this.db.prepare(sql).get(slug) as any;
      if (!row) return null;

      const product = this.formatProduct(row);
      const images = this.db.prepare(`
        SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC
      `).all(product.id) as any[];
      product.images = images;

      return this.toPlain(product);
    } catch {
      const prod = this.memProducts.find((p) => p.slug === slug);
      return prod ? this.toPlain(prod) : null;
    }
  }

  public getProductById(id: string): Product | null {
    if (this.isMemoryFallback || !this.db) {
      const prod = this.memProducts.find((p) => p.id === id);
      return prod ? this.toPlain(prod) : null;
    }

    try {
      const sql = `
        SELECT p.*, 
          m.name as marketplace_name, m.slug as marketplace_slug, m.logo as marketplace_logo, m.website as marketplace_website,
          c.name as category_name, c.slug as category_slug, c.image as category_image,
          (SELECT COUNT(*) FROM clicks WHERE product_id = p.id) as clicks_count
        FROM products p
        LEFT JOIN marketplaces m ON p.marketplace_id = m.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `;
      const row = this.db.prepare(sql).get(id) as any;
      if (!row) return null;
      return this.toPlain(this.formatProduct(row));
    } catch {
      const prod = this.memProducts.find((p) => p.id === id);
      return prod ? this.toPlain(prod) : null;
    }
  }

  public getFeaturedDeal(): Product | null {
    const activeProducts = this.getProducts({ status: 'ACTIVE', featured: true });
    return activeProducts.length > 0 ? activeProducts[0] : null;
  }

  public getRelatedProducts(categoryId: string, currentProductId: string, limit = 4): Product[] {
    const list = this.getProducts({ status: 'ACTIVE' });
    return list
      .filter((p) => p.id !== currentProductId && (p.category_id === categoryId || !categoryId))
      .slice(0, limit);
  }

  public createProduct(data: Partial<Product>): Product {
    const id = data.id || `prod_${Date.now()}`;
    const slug = data.slug || this.generateSlug(data.title || 'deal');
    const now = new Date().toISOString();
    const discount = Math.round(((Number(data.original_price || 0) - Number(data.current_price || 0)) / Number(data.original_price || 1)) * 100);

    const newProd: Product = {
      id,
      title: data.title || 'Untitled Deal',
      slug,
      description: data.description || '',
      current_price: Number(data.current_price || 0),
      original_price: Number(data.original_price || 0),
      discount_percentage: Math.max(0, discount),
      marketplace_id: data.marketplace_id || '',
      category_id: data.category_id || '',
      affiliate_url: data.affiliate_url || '',
      image_url: data.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
      badge: data.badge || 'HOT DEAL',
      status: data.status || 'ACTIVE',
      featured: Boolean(data.featured),
      created_at: now,
      updated_at: now,
      clicks_count: 0
    };

    this.memProducts.unshift(newProd);

    if (this.db) {
      try {
        const stmt = this.db.prepare(`
          INSERT INTO products (
            id, title, slug, description, current_price, original_price, discount_percentage,
            marketplace_id, category_id, affiliate_url, image_url, badge, status, featured, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
          id,
          newProd.title,
          slug,
          newProd.description,
          newProd.current_price,
          newProd.original_price,
          newProd.discount_percentage,
          newProd.marketplace_id,
          newProd.category_id,
          newProd.affiliate_url,
          newProd.image_url,
          newProd.badge,
          newProd.status,
          newProd.featured ? 1 : 0,
          now,
          now
        );
      } catch (err) {
        console.warn('[Tarzer DB] Insert product SQLite error:', err);
      }
    }

    return newProd;
  }

  public updateProduct(id: string, data: Partial<Product>): Product | null {
    const existing = this.getProductById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const curPrice = data.current_price !== undefined ? Number(data.current_price) : existing.current_price;
    const origPrice = data.original_price !== undefined ? Number(data.original_price) : existing.original_price;
    const discount = origPrice > 0 ? Math.round(((origPrice - curPrice) / origPrice) * 100) : existing.discount_percentage;

    const updated: Product = {
      ...existing,
      title: data.title ?? existing.title,
      slug: data.slug ?? existing.slug,
      description: data.description ?? existing.description,
      current_price: curPrice,
      original_price: origPrice,
      discount_percentage: Math.max(0, discount),
      marketplace_id: data.marketplace_id !== undefined ? data.marketplace_id : existing.marketplace_id,
      category_id: data.category_id !== undefined ? data.category_id : existing.category_id,
      affiliate_url: data.affiliate_url ?? existing.affiliate_url,
      image_url: data.image_url ?? existing.image_url,
      badge: data.badge ?? existing.badge,
      status: data.status ?? existing.status,
      featured: data.featured !== undefined ? Boolean(data.featured) : existing.featured,
      updated_at: now
    };

    const memIdx = this.memProducts.findIndex((p) => p.id === id);
    if (memIdx >= 0) {
      this.memProducts[memIdx] = updated;
    }

    if (this.db) {
      try {
        const stmt = this.db.prepare(`
          UPDATE products SET
            title = ?, slug = ?, description = ?, current_price = ?, original_price = ?,
            discount_percentage = ?, marketplace_id = ?, category_id = ?, affiliate_url = ?,
            image_url = ?, badge = ?, status = ?, featured = ?, updated_at = ?
          WHERE id = ?
        `);
        stmt.run(
          updated.title, updated.slug, updated.description, updated.current_price, updated.original_price,
          updated.discount_percentage, updated.marketplace_id, updated.category_id, updated.affiliate_url,
          updated.image_url, updated.badge, updated.status, updated.featured ? 1 : 0, now, id
        );
      } catch (err) {
        console.warn('[Tarzer DB] update product SQLite error:', err);
      }
    }

    return updated;
  }

  public deleteProduct(id: string): boolean {
    this.memProducts = this.memProducts.filter((p) => p.id !== id);
    if (this.db) {
      try {
        this.db.prepare('DELETE FROM product_images WHERE product_id = ?').run(id);
        this.db.prepare('DELETE FROM clicks WHERE product_id = ?').run(id);
        const res = this.db.prepare('DELETE FROM products WHERE id = ?').run(id);
        return res.changes > 0;
      } catch {
        return true;
      }
    }
    return true;
  }

  // ================= CATEGORIES CRUD =================
  public getCategories(): Category[] {
    if (this.isMemoryFallback || !this.db) {
      return this.toPlain(this.memCategories);
    }
    try {
      const rows = this.db.prepare(`
        SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id AND status = 'ACTIVE') as product_count
        FROM categories c
        ORDER BY c.name ASC
      `).all() as any[];
      return rows && rows.length > 0 ? this.toPlain(rows) : this.toPlain(this.memCategories);
    } catch {
      return this.toPlain(this.memCategories);
    }
  }

  public getCategoryBySlug(slug: string): Category | null {
    const list = this.getCategories();
    return list.find((c) => c.slug === slug) || null;
  }

  public createCategory(data: Partial<Category>): Category {
    const id = data.id || `cat_${Date.now()}`;
    const slug = data.slug || this.generateSlug(data.name || 'category');
    const now = new Date().toISOString();
    const image = data.image || 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80';

    const cat: Category = {
      id,
      name: data.name || 'Untitled Category',
      slug,
      image,
      product_count: 0
    };

    this.memCategories.push(cat);

    if (this.db) {
      try {
        this.db.prepare(`
          INSERT OR REPLACE INTO categories (id, name, slug, image, created_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(id, cat.name, slug, image, now);
      } catch (err) {
        console.warn('[Tarzer DB] create category error:', err);
      }
    }

    return cat;
  }

  public deleteCategory(id: string): boolean {
    this.memCategories = this.memCategories.filter((c) => c.id !== id);
    if (this.db) {
      try {
        const res = this.db.prepare('DELETE FROM categories WHERE id = ?').run(id);
        return res.changes > 0;
      } catch {
        return true;
      }
    }
    return true;
  }

  // ================= MARKETPLACES CRUD =================
  public getMarketplaces(): Marketplace[] {
    if (this.isMemoryFallback || !this.db) {
      return this.toPlain(this.memMarketplaces);
    }
    try {
      const rows = this.db.prepare(`
        SELECT m.*, (SELECT COUNT(*) FROM products WHERE marketplace_id = m.id AND status = 'ACTIVE') as product_count
        FROM marketplaces m
        ORDER BY m.name ASC
      `).all() as any[];
      return rows && rows.length > 0 ? this.toPlain(rows) : this.toPlain(this.memMarketplaces);
    } catch {
      return this.toPlain(this.memMarketplaces);
    }
  }

  public getMarketplaceBySlug(slug: string): Marketplace | null {
    const list = this.getMarketplaces();
    return list.find((m) => m.slug === slug) || null;
  }

  // ================= HERO SLIDES CRUD =================
  public getHeroSlides(activeOnly = true): HeroSlide[] {
    if (this.isMemoryFallback || !this.db) {
      const list = activeOnly ? this.memHeroSlides.filter((s) => s.active) : this.memHeroSlides;
      return this.toPlain(list);
    }
    try {
      const sql = activeOnly
        ? `SELECT * FROM hero_slides WHERE active = 1 ORDER BY display_order ASC`
        : `SELECT * FROM hero_slides ORDER BY display_order ASC`;
      const rows = this.db.prepare(sql).all() as any[];
      if (rows && rows.length > 0) {
        return this.toPlain(rows.map((r) => ({ ...r, active: Boolean(r.active) })));
      }
      return this.toPlain(this.memHeroSlides);
    } catch {
      return this.toPlain(this.memHeroSlides);
    }
  }

  public updateHeroSlide(id: string, data: Partial<HeroSlide>): HeroSlide | null {
    const memSlide = this.memHeroSlides.find((s) => s.id === id);
    if (memSlide) {
      Object.assign(memSlide, data);
    }

    if (this.db) {
      try {
        const existing = this.db.prepare(`SELECT * FROM hero_slides WHERE id = ?`).get(id) as any;
        if (existing) {
          const stmt = this.db.prepare(`
            UPDATE hero_slides SET
              title = ?, subtitle = ?, image = ?, button_text = ?, button_url = ?,
              theme = ?, display_order = ?, active = ?
            WHERE id = ?
          `);
          stmt.run(
            data.title ?? existing.title,
            data.subtitle ?? existing.subtitle,
            data.image ?? existing.image,
            data.button_text ?? existing.button_text,
            data.button_url ?? existing.button_url,
            data.theme ?? existing.theme,
            data.display_order ?? existing.display_order,
            data.active !== undefined ? (data.active ? 1 : 0) : existing.active,
            id
          );
        }
      } catch (err) {
        console.warn('[Tarzer DB] update hero slide error:', err);
      }
    }

    return memSlide || null;
  }

  // ================= CLICKS & ANALYTICS =================
  public recordClick(productId: string, marketplaceId?: string, referrer?: string): string {
    const id = `clk_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date().toISOString();

    this.memClicks.push({
      id,
      product_id: productId,
      marketplace_id: marketplaceId || '',
      referrer: referrer || '',
      clicked_at: now
    });

    if (this.db) {
      try {
        this.db.prepare(`
          INSERT INTO clicks (id, product_id, marketplace_id, referrer, clicked_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(id, productId, marketplaceId || null, referrer || null, now);
      } catch (err) {
        console.warn('[Tarzer DB] record click error:', err);
      }
    }
    return id;
  }

  public getAnalytics() {
    const totalProducts = this.memProducts.length;
    const activeDeals = this.memProducts.filter((p) => p.status === 'ACTIVE').length;
    const totalClicks = this.memClicks.length;

    return this.toPlain({
      totalProducts,
      activeDeals,
      totalClicks,
      topPerformingProduct: {
        id: 'prod_placeholder',
        title: 'Acid-Wash Graphic Tee',
        image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
        current_price: 499,
        discount_percentage: 62,
        clicks: totalClicks
      },
      topMarketplace: { name: 'Amazon', clicks: totalClicks },
      recentProducts: this.memProducts.slice(0, 5),
      recentClicks: this.memClicks.slice(0, 10),
      marketplaceBreakdown: DEFAULT_MARKETPLACES.map((m) => ({ name: m.name, clicks: 0 }))
    });
  }

  // ================= USERS & AUTH =================
  public getUserByEmail(email: string): User | null {
    if (email === 'admin@tarzer.in') {
      return {
        id: 'u_admin_1',
        email: 'admin@tarzer.in',
        role: 'ADMIN',
        created_at: new Date().toISOString()
      };
    }
    if (this.db) {
      try {
        const row = this.db.prepare('SELECT id, email, role, created_at FROM users WHERE email = ?').get(email) as any;
        return row || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  public verifyAdminCredentials(email: string, pass: string): boolean {
    if (email === 'admin@tarzer.in' && pass === 'tarzeradmin123') {
      return true;
    }
    if (this.db) {
      try {
        const row = this.db.prepare('SELECT password_hash FROM users WHERE email = ?').get(email) as any;
        return row ? row.password_hash === pass : false;
      } catch {
        return false;
      }
    }
    return false;
  }

  private formatProduct(row: any): Product {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      current_price: Number(row.current_price),
      original_price: Number(row.original_price),
      discount_percentage: Number(row.discount_percentage),
      marketplace_id: row.marketplace_id,
      category_id: row.category_id,
      affiliate_url: row.affiliate_url,
      image_url: row.image_url,
      badge: row.badge,
      status: row.status,
      featured: Boolean(row.featured),
      created_at: row.created_at,
      updated_at: row.updated_at,
      clicks_count: Number(row.clicks_count || 0),
      marketplace: row.marketplace_name ? {
        id: row.marketplace_id,
        name: row.marketplace_name,
        slug: row.marketplace_slug,
        logo: row.marketplace_logo,
        website: row.marketplace_website
      } : undefined,
      category: row.category_name ? {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        image: row.category_image
      } : undefined
    };
  }

  private generateSlug(text: string): string {
    const base = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${base}-${Math.random().toString(36).substr(2, 4)}`;
  }

  // ================= SYSTEM SETTINGS =================
  getSetting(key: string, defaultValue: string = ''): string {
    // Priority: Environment variables
    if (key === 'building_mode' && process.env.NEXT_PUBLIC_BUILDING_MODE !== undefined) {
      return process.env.NEXT_PUBLIC_BUILDING_MODE;
    }

    if (this.memSettings[key] !== undefined) {
      return this.memSettings[key];
    }

    if (this.db) {
      try {
        const stmt = this.db.prepare('SELECT value FROM system_settings WHERE key = ?');
        const row = stmt.get(key) as { value: string } | undefined;
        if (row && row.value !== undefined) {
          this.memSettings[key] = row.value;
          return row.value;
        }
      } catch {
        // use fallback
      }
    }

    return defaultValue;
  }

  setSetting(key: string, value: string): void {
    this.memSettings[key] = value;
    if (this.db) {
      try {
        const stmt = this.db.prepare(`
          INSERT INTO system_settings (key, value)
          VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `);
        stmt.run(key, value);
      } catch (err) {
        console.warn('[Tarzer DB] setSetting error:', err);
      }
    }
  }

  getAllSettings(): Record<string, string> {
    if (this.db) {
      try {
        const stmt = this.db.prepare('SELECT key, value FROM system_settings');
        const rows = stmt.all() as { key: string; value: string }[];
        const res: Record<string, string> = { ...this.memSettings };
        for (const r of rows) {
          res[r.key] = r.value;
        }
        return res;
      } catch {
        return { ...this.memSettings };
      }
    }
    return { ...this.memSettings };
  }
}

// Global Singleton to preserve connection across Next.js reloads
declare global {
  var __tarzerDb: TarzerDatabase | undefined;
}

if (globalThis.__tarzerDb) {
  Object.setPrototypeOf(globalThis.__tarzerDb, TarzerDatabase.prototype);
}

export const db = globalThis.__tarzerDb || new TarzerDatabase();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__tarzerDb = db;
}
