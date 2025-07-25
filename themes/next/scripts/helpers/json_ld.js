function jsonLd() {
  const page = this.page;
  const config = this.config;
  const theme = this.theme;
  const authorEmail = config.author.email || "";
  const authorImage = config.author.picture || (authorEmail ? this.gravatar(authorEmail) : null);
  const authorLinks = config.authorLink;
  const links = [];

  if (authorLinks) {
    links.push(authorLinks);
  }

  const author = {
    "@type": "Person",
    name: config.author,
    sameAs: links,
  };
  const publisher = Object.assign({}, author, { "@type": "Organization" });
  let schema = {};

  if (authorImage) {
    author.image = authorImage;
    publisher.image = authorImage;
    publisher.logo = {
      "@type": "ImageObject",
      url: authorImage,
    };
  }

  if (this.is_post()) {
    let images = [];
    
    const content = this.strip_html(page.content);
    const wordCount = content.replace(/\s+/g, ' ').trim().length;
    const readingTime = Math.ceil(wordCount / 400);
    
    schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      author: author,
      articleBody: content,
      dateCreated: page.date.format(),
      dateModified: page.updated.format(),
      datePublished: page.date.format(),
      description: this.strip_html(page.excerpt),
      headline: page.title,
      image: images,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": this.url_for(page.permalink),
      },
      publisher,
      url: this.url_for(page.permalink),
      wordCount: wordCount,
      timeRequired: `PT${readingTime}M`,
    };

    if (page.tags && page.tags.length > 0) {
      schema.keywords = page.tags.map((tag) => tag.name).join(", ");
    }

    if (page.coverImage) {
      const coverImageObj = {
        "@type": "ImageObject",
        url: page.coverImage,
        contentUrl: page.coverImage,
        caption: `${page.title} - 封面圖`,
        description: `${page.title} 文章的封面圖片`,
        encodingFormat: page.coverImage.includes('.png') ? 'image/png' : 
                       page.coverImage.includes('.jpg') || page.coverImage.includes('.jpeg') ? 'image/jpeg' :
                       page.coverImage.includes('.webp') ? 'image/webp' : 'image/jpeg'
      };
      
      if (page.coverImageWidth && page.coverImageHeight) {
        coverImageObj.width = page.coverImageWidth;
        coverImageObj.height = page.coverImageHeight;
      }
      
      images.push(coverImageObj);
      schema.thumbnailUrl = page.coverImage;
    } else if (config.defaultImage) {
      const defaultImageObj = {
        "@type": "ImageObject",
        url: config.defaultImage,
        contentUrl: config.defaultImage,
        caption: `${page.title} - 預設圖片`,
        description: `${page.title} 文章的預設封面圖片`,
        encodingFormat: config.defaultImage.includes('.png') ? 'image/png' : 'image/jpeg'
      };
      
      images.push(defaultImageObj);
      schema.thumbnailUrl = config.defaultImage;
    }

    schema.image = images;
  } else if (this.is_page() || this.is_home()) {
    schema = {
      "@context": "https://schema.org",
      "@type": "Website",
      "@id": config.url,
      author: author,
      name: config.title,
      description: config.description,
      url: config.url,
      keywords: config.keywords
    };

    if (config.keywords && config.keywords.length > 0) {
    //   schema.keywords = config.keywords.join(", ");
    }
  }

  return (
    '<script type="application/ld+json">' + JSON.stringify(schema) + "</script>"
  );
}

function breadcrumbLd() {
  const page = this.page;
  const config = this.config;
  
  let breadcrumbItems = [];
  let position = 1;
  
  breadcrumbItems.push({
    "@type": "ListItem",
    position: position++,
    name: "首頁",
    item: {
      "@type": "WebPage",
      "@id": config.url
    }
  });
  
  if (this.is_post()) {
    if (page.categories && page.categories.length > 0) {
      page.categories.forEach(category => {
        breadcrumbItems.push({
          "@type": "ListItem",
          position: position++,
          name: category.name,
          item: {
            "@type": "CollectionPage",
            "@id": this.url_for(`/categories/${category.slug}/`)
          }
        });
      });
    }
    
    if ((!page.categories || page.categories.length === 0) && page.tags && page.tags.length > 0) {
      const mainTag = page.tags.data[0];
      breadcrumbItems.push({
        "@type": "ListItem",
        position: position++,
        name: mainTag.name,
        item: {
          "@type": "CollectionPage",
          "@id": this.url_for(`/tags/${mainTag.slug}/`)
        }
      });
    }
    
    breadcrumbItems.push({
      "@type": "ListItem",
      position: position,
      name: page.title
    });
  } else if (this.is_page()) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: position,
      name: page.title
    });
  }
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems
  };
  
  return (
    '<script type="application/ld+json">' + JSON.stringify(breadcrumbSchema) + "</script>"
  );
}

hexo.extend.helper.register("json_ld", jsonLd);
hexo.extend.helper.register("breadcrumb_ld", breadcrumbLd);
