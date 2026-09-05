import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { Product, Category, Marketplace, HeroSlide, Click, User, FilterOptions } from './types';

// Resolve database path in the project root
const dbDir = process.cwd();
const dbPath = path.join(dbDir, 'tarzer.db');

class TarzerDatabase {
  private db: DatabaseSync;

  constructor() {
    this.db = new DatabaseSync(dbPath);
    this.initTables();
    this.seedDefaultsIfEmpty();
  }

  private initTables() {
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      
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
    const userCount = (this.db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
    if (userCount === 0) {
      this.seedData();
      return;
    }

    // Ensure newly added default categories exist in DB
    const coreCategories = [
      { id: 'cat_men', name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80' },
      { id: 'cat_women', name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80' },
      { id: 'cat_kids', name: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80' },
      { id: 'cat_streetwear', name: 'Streetwear', slug: 'streetwear', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80' },
      { id: 'cat_genz', name: 'Gen Z', slug: 'gen-z', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80' },
      { id: 'cat_korean', name: 'Korean', slug: 'korean', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80' },
    ];
    const insertCat = this.db.prepare(`
      INSERT OR IGNORE INTO categories (id, name, slug, image, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    for (const cat of coreCategories) {
      insertCat.run(cat.id, cat.name, cat.slug, cat.image, now);
    }
  }

  public seedData() {
    const now = new Date().toISOString();

    // 1. Admin User (admin@tarzer.in / tarzeradmin123)
    const insertUser = this.db.prepare(`
      INSERT OR REPLACE INTO users (id, email, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    // Simple hash for built-in test admin (sha256/bcrypt equivalent)
    insertUser.run('u_admin_1', 'admin@tarzer.in', 'tarzeradmin123', 'ADMIN', now);

    // 2. Marketplaces
    const marketplaces = [
      { id: 'mp_amazon', name: 'Amazon', slug: 'amazon', logo: 'https://images.unsplash.com/photo-1523474255658-4af61b1614ff?w=120&h=120&fit=crop', website: 'https://www.amazon.in' },
      { id: 'mp_myntra', name: 'Myntra', slug: 'myntra', logo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=120&fit=crop', website: 'https://www.myntra.com' },
      { id: 'mp_meesho', name: 'Meesho', slug: 'meesho', logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop', website: 'https://www.meesho.com' },
      { id: 'mp_shopsy', name: 'Shopsy', slug: 'shopsy', logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=120&h=120&fit=crop', website: 'https://www.shopsy.in' }
    ];

    const insertMp = this.db.prepare(`
      INSERT OR REPLACE INTO marketplaces (id, name, slug, logo, website, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const mp of marketplaces) {
      insertMp.run(mp.id, mp.name, mp.slug, mp.logo, mp.website, now);
    }

    // 3. Categories (Streetwear, T-Shirts, Hoodies, Jeans, Jackets, Shoes, Shirts, Accessories, Men, Women, Kids, Gen Z, Korean)
    const categories = [
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

    const insertCat = this.db.prepare(`
      INSERT OR REPLACE INTO categories (id, name, slug, image, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const cat of categories) {
      insertCat.run(cat.id, cat.name, cat.slug, cat.image, now);
    }

    // 4. Hero Slides (matching exact specifications)
    const slides = [
      {
        id: 'slide_1',
        title: 'LOOK EXPENSIVE.\nPAY LESS.',
        subtitle: 'The best fashion deals from your favorite stores, all in one place.',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=2560&auto=format&fit=crop&q=95',
        button_text: 'EXPLORE DEALS',
        button_url: '/deals',
        theme: 'orange',
        display_order: 1,
        active: 1
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
        active: 1
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
        active: 1
      }
    ];

    const insertSlide = this.db.prepare(`
      INSERT OR REPLACE INTO hero_slides (id, title, subtitle, image, button_text, button_url, theme, display_order, active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const slide of slides) {
      insertSlide.run(slide.id, slide.title, slide.subtitle, slide.image, slide.button_text, slide.button_url, slide.theme, slide.display_order, slide.active, now);
    }
    // 5. Default System Settings
    const insertSetting = this.db.prepare(`
      INSERT OR IGNORE INTO system_settings (key, value)
      VALUES (?, ?)
    `);
    insertSetting.run('building_mode', '0');
  }


  public clearAllMockProducts(): void {
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

  private toPlain<T>(data: T): T {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
  }

  // ================= PRODUCTS CRUD =================
  public getProducts(filters?: FilterOptions): Product[] {
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

    if (filters?.minPrice !== undefined && filters.minPrice > 0) {
      sql += ' AND p.current_price >= ?';
      params.push(filters.minPrice);
    }

    if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
      sql += ' AND p.current_price <= ?';
      params.push(filters.maxPrice);
    }

    if (filters?.minDiscount !== undefined && filters.minDiscount > 0) {
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

    // Sorting
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
  }

  public getProductBySlug(slug: string): Product | null {
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
    // Get all gallery images
    const images = this.db.prepare(`
      SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC
    `).all(product.id) as any[];
    product.images = images;

    return this.toPlain(product);
  }

  public getProductById(id: string): Product | null {
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
  }

  public getFeaturedDeal(): Product | null {
    const sql = `
      SELECT p.*, 
        m.name as marketplace_name, m.slug as marketplace_slug, m.logo as marketplace_logo, m.website as marketplace_website,
        c.name as category_name, c.slug as category_slug, c.image as category_image,
        (SELECT COUNT(*) FROM clicks WHERE product_id = p.id) as clicks_count
      FROM products p
      LEFT JOIN marketplaces m ON p.marketplace_id = m.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'ACTIVE' AND p.featured = 1
      ORDER BY p.discount_percentage DESC, p.created_at DESC
      LIMIT 1
    `;
    const row = this.db.prepare(sql).get() as any;
    return row ? this.toPlain(this.formatProduct(row)) : null;
  }

  public getRelatedProducts(categoryId: string, currentProductId: string, limit = 4): Product[] {
    const sql = `
      SELECT p.*, 
        m.name as marketplace_name, m.slug as marketplace_slug, m.logo as marketplace_logo, m.website as marketplace_website,
        c.name as category_name, c.slug as category_slug, c.image as category_image
      FROM products p
      LEFT JOIN marketplaces m ON p.marketplace_id = m.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'ACTIVE' AND p.id != ? AND (p.category_id = ? OR 1=1)
      ORDER BY (p.category_id = ?) DESC, p.discount_percentage DESC
      LIMIT ?
    `;
    const rows = this.db.prepare(sql).all(currentProductId, categoryId, categoryId, limit) as any[];
    return this.toPlain(rows.map((r) => this.formatProduct(r)));
  }

  public createProduct(data: Partial<Product>): Product {
    const id = data.id || `prod_${Date.now()}`;
    const slug = data.slug || this.generateSlug(data.title || 'deal');
    const now = new Date().toISOString();
    const discount = Math.round(((Number(data.original_price || 0) - Number(data.current_price || 0)) / Number(data.original_price || 1)) * 100);

    const stmt = this.db.prepare(`
      INSERT INTO products (
        id, title, slug, description, current_price, original_price, discount_percentage,
        marketplace_id, category_id, affiliate_url, image_url, badge, status, featured, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      data.title || 'Untitled Deal',
      slug,
      data.description || '',
      Number(data.current_price || 0),
      Number(data.original_price || 0),
      Math.max(0, discount),
      data.marketplace_id || null,
      data.category_id || null,
      data.affiliate_url || '',
      data.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
      data.badge || 'HOT DEAL',
      data.status || 'ACTIVE',
      data.featured ? 1 : 0,
      now,
      now
    );

    // Save additional images
    if (data.image_url) {
      this.db.prepare(`INSERT OR REPLACE INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)`).run(
        `img_${id}_main`, id, data.image_url, 0
      );
    }
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((img, idx) => {
        const imgUrl = typeof img === 'string' ? img : img.image_url;
        this.db.prepare(`INSERT OR REPLACE INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)`).run(
          `img_${id}_${idx + 1}`, id, imgUrl, idx + 1
        );
      });
    }

    return this.getProductById(id)!;
  }

  public updateProduct(id: string, data: Partial<Product>): Product | null {
    const existing = this.getProductById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const curPrice = data.current_price !== undefined ? Number(data.current_price) : existing.current_price;
    const origPrice = data.original_price !== undefined ? Number(data.original_price) : existing.original_price;
    const discount = origPrice > 0 ? Math.round(((origPrice - curPrice) / origPrice) * 100) : existing.discount_percentage;

    const stmt = this.db.prepare(`
      UPDATE products SET
        title = ?,
        slug = ?,
        description = ?,
        current_price = ?,
        original_price = ?,
        discount_percentage = ?,
        marketplace_id = ?,
        category_id = ?,
        affiliate_url = ?,
        image_url = ?,
        badge = ?,
        status = ?,
        featured = ?,
        updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      data.title ?? existing.title,
      data.slug ?? existing.slug,
      data.description ?? existing.description,
      curPrice,
      origPrice,
      Math.max(0, discount),
      data.marketplace_id !== undefined ? data.marketplace_id : existing.marketplace_id,
      data.category_id !== undefined ? data.category_id : existing.category_id,
      data.affiliate_url ?? existing.affiliate_url,
      data.image_url ?? existing.image_url,
      data.badge ?? existing.badge,
      data.status ?? existing.status,
      data.featured !== undefined ? (data.featured ? 1 : 0) : (existing.featured ? 1 : 0),
      now,
      id
    );

    return this.getProductById(id);
  }

  public deleteProduct(id: string): boolean {
    this.db.prepare('DELETE FROM product_images WHERE product_id = ?').run(id);
    this.db.prepare('DELETE FROM clicks WHERE product_id = ?').run(id);
    const res = this.db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return res.changes > 0;
  }

  // ================= CATEGORIES CRUD =================
  public getCategories(): Category[] {
    const rows = this.db.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id AND status = 'ACTIVE') as product_count
      FROM categories c
      ORDER BY c.name ASC
    `).all() as any[];
    return this.toPlain(rows);
  }

  public getCategoryBySlug(slug: string): Category | null {
    const row = this.db.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id AND status = 'ACTIVE') as product_count
      FROM categories c
      WHERE c.slug = ?
    `).get(slug) as any;
    return row ? this.toPlain(row) : null;
  }

  public createCategory(data: Partial<Category>): Category {
    const id = data.id || `cat_${Date.now()}`;
    const slug = data.slug || this.generateSlug(data.name || 'category');
    const now = new Date().toISOString();
    const image = data.image || 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80';

    this.db.prepare(`
      INSERT OR REPLACE INTO categories (id, name, slug, image, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, data.name || 'Untitled Category', slug, image, now);

    return this.getCategoryBySlug(slug)!;
  }

  public deleteCategory(id: string): boolean {
    const res = this.db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return res.changes > 0;
  }

  // ================= MARKETPLACES CRUD =================
  public getMarketplaces(): Marketplace[] {
    const rows = this.db.prepare(`
      SELECT m.*, (SELECT COUNT(*) FROM products WHERE marketplace_id = m.id AND status = 'ACTIVE') as product_count
      FROM marketplaces m
      ORDER BY m.name ASC
    `).all() as any[];
    return this.toPlain(rows);
  }

  public getMarketplaceBySlug(slug: string): Marketplace | null {
    const row = this.db.prepare(`
      SELECT m.*, (SELECT COUNT(*) FROM products WHERE marketplace_id = m.id AND status = 'ACTIVE') as product_count
      FROM marketplaces m
      WHERE m.slug = ?
    `).get(slug) as any;
    return row ? this.toPlain(row) : null;
  }

  // ================= HERO SLIDES CRUD =================
  public getHeroSlides(activeOnly = true): HeroSlide[] {
    const sql = activeOnly
      ? `SELECT * FROM hero_slides WHERE active = 1 ORDER BY display_order ASC`
      : `SELECT * FROM hero_slides ORDER BY display_order ASC`;
    const rows = this.db.prepare(sql).all() as any[];
    const formatted = rows.map((r) => ({
      ...r,
      active: Boolean(r.active)
    }));
    return this.toPlain(formatted);
  }

  public updateHeroSlide(id: string, data: Partial<HeroSlide>): HeroSlide | null {
    const existing = this.db.prepare(`SELECT * FROM hero_slides WHERE id = ?`).get(id) as any;
    if (!existing) return null;

    const stmt = this.db.prepare(`
      UPDATE hero_slides SET
        title = ?,
        subtitle = ?,
        image = ?,
        button_text = ?,
        button_url = ?,
        theme = ?,
        display_order = ?,
        active = ?
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

    const updated = this.db.prepare(`SELECT * FROM hero_slides WHERE id = ?`).get(id) as any;
    return this.toPlain({ ...updated, active: Boolean(updated.active) });
  }

  // ================= CLICKS & ANALYTICS =================
  public recordClick(productId: string, marketplaceId?: string, referrer?: string): string {
    const id = `clk_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO clicks (id, product_id, marketplace_id, referrer, clicked_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, productId, marketplaceId || null, referrer || null, now);
    return id;
  }

  public getAnalytics() {
    const totalProducts = (this.db.prepare('SELECT COUNT(*) as c FROM products').get() as any).c;
    const activeDeals = (this.db.prepare("SELECT COUNT(*) as c FROM products WHERE status = 'ACTIVE'").get() as any).c;
    const totalClicks = (this.db.prepare('SELECT COUNT(*) as c FROM clicks').get() as any).c;

    // Top performing product
    const topProductRow = this.db.prepare(`
      SELECT p.id, p.title, p.current_price, p.discount_percentage, p.image_url, COUNT(c.id) as clicks
      FROM clicks c
      JOIN products p ON c.product_id = p.id
      GROUP BY p.id
      ORDER BY clicks DESC
      LIMIT 1
    `).get() as any;

    // Top marketplace
    const topMarketplaceRow = this.db.prepare(`
      SELECT m.id, m.name, m.slug, COUNT(c.id) as clicks
      FROM clicks c
      JOIN marketplaces m ON c.marketplace_id = m.id
      GROUP BY m.id
      ORDER BY clicks DESC
      LIMIT 1
    `).get() as any;

    // Recent products
    const recentProducts = this.getProducts({ sort: 'latest' }).slice(0, 5);

    // Recent clicks
    const recentClicks = this.db.prepare(`
      SELECT c.id, c.clicked_at, c.referrer, p.title as product_title, p.slug as product_slug, m.name as marketplace_name
      FROM clicks c
      LEFT JOIN products p ON c.product_id = p.id
      LEFT JOIN marketplaces m ON c.marketplace_id = m.id
      ORDER BY c.clicked_at DESC
      LIMIT 10
    `).all() as any[];

    // Marketplace breakdown
    const marketplaceBreakdown = this.db.prepare(`
      SELECT m.name, COUNT(c.id) as clicks
      FROM marketplaces m
      LEFT JOIN clicks c ON c.marketplace_id = m.id
      GROUP BY m.id
      ORDER BY clicks DESC
    `).all() as any[];

    return this.toPlain({
      totalProducts,
      activeDeals,
      totalClicks,
      topPerformingProduct: topProductRow || { title: 'Acid-Wash Graphic Tee', clicks: 0 },
      topMarketplace: topMarketplaceRow || { name: 'Amazon', clicks: 0 },
      recentProducts,
      recentClicks,
      marketplaceBreakdown
    });
  }

  // ================= USERS & AUTH =================
  public getUserByEmail(email: string): User | null {
    const row = this.db.prepare('SELECT id, email, role, created_at FROM users WHERE email = ?').get(email) as any;
    return row || null;
  }

  public verifyAdminCredentials(email: string, pass: string): boolean {
    const row = this.db.prepare('SELECT password_hash FROM users WHERE email = ?').get(email) as any;
    if (!row) return false;
    return row.password_hash === pass;
  }

  // Helper to format database product row to Product object
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

  getSetting(key: string, defaultValue: string = ''): string {
    try {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS system_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);
      const stmt = this.db.prepare('SELECT value FROM system_settings WHERE key = ?');
      const row = stmt.get(key) as { value: string } | undefined;
      return row ? row.value : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  setSetting(key: string, value: string): void {
    try {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS system_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);
      const stmt = this.db.prepare(`
        INSERT INTO system_settings (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `);
      stmt.run(key, value);
    } catch (err) {
      console.error('Failed to save setting:', err);
    }
  }

  getAllSettings(): Record<string, string> {
    try {
      const stmt = this.db.prepare('SELECT key, value FROM system_settings');
      const rows = stmt.all() as { key: string; value: string }[];
      const res: Record<string, string> = {};
      for (const r of rows) {
        res[r.key] = r.value;
      }
      return res;
    } catch {
      return {};
    }
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
