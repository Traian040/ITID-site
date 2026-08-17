const currentMenuTitle = document.body.getAttribute('data-menu-title');
let categoryPages = []; 

async function initializeApp() {
  if (!currentMenuTitle) return;

  try {
    const url = 'http://localhost:1338/api/pages?populate[menu_element]=true&populate[content_sections][populate]=*&populate[side_menu][populate]=*';
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Strapi Error ${response.status}`);
    
    const json = await response.json();
    
    for (let page of json.data) {
      const menuData = page.menu_element?.data ? page.menu_element.data.attributes : page.menu_element;
      const menuTitle = menuData?.title || menuData?.name || menuData?.Title || "";
      
      if (menuTitle.toLowerCase().includes(currentMenuTitle.toLowerCase())) {
        categoryPages.push(page);
      }
    }

    if (categoryPages.length > 0) {
      let startPage = categoryPages.find(p => p.title.toLowerCase().includes(currentMenuTitle.toLowerCase()));
      if (!startPage) startPage = categoryPages[0]; 
      
      renderPage(startPage);
    } else {
      const contentEl = document.getElementById('dynamic-content');
      if (contentEl) contentEl.innerHTML = `<p style="color:red;">Could not find a page for ${currentMenuTitle}.</p>`;
    }

  } catch (error) {
    console.error("Failed to load data:", error);
  }
}

function renderPage(page) {
  const heroTitleEl = document.getElementById('hero-title');
  const heroSubtitleEl = document.getElementById('hero-subtitle');
  const sidebarTitleEl = document.getElementById('sidebar-title');

  if (heroTitleEl) heroTitleEl.textContent = currentMenuTitle;
  if (heroSubtitleEl) heroSubtitleEl.textContent = page.title; 
  if (sidebarTitleEl) sidebarTitleEl.textContent = currentMenuTitle;

  let sideLinks = [];
  if (page.side_menu) {
    const findLinks = (obj) => {
      if (Array.isArray(obj)) {
        if (obj.length > 0 && obj[0].text !== undefined && obj[0].url !== undefined) {
          sideLinks = sideLinks.concat(obj); 
        } else obj.forEach(findLinks);
      } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(findLinks);
      }
    };
    findLinks(page.side_menu);
  }

  const sidebarMenu = document.getElementById('dynamic-sidebar');
  if (sidebarMenu) {
    sidebarMenu.innerHTML = ''; 
    
    if (sideLinks.length > 0) {
      sideLinks.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = link.text;
        
        const targetSubPage = categoryPages.find(p => p.title.toLowerCase() === link.text.toLowerCase());
        
        if (targetSubPage) {
          a.href = '#';
          a.onclick = (e) => {
            e.preventDefault();
            renderPage(targetSubPage); 
          };
        } else {
          a.href = link.url;
          a.target = link.url.startsWith('http') ? '_blank' : '_self';
        }
        
        li.appendChild(a);
        sidebarMenu.appendChild(li);
      });
    }
  }

  const contentArea = document.getElementById('dynamic-content');
  if (contentArea) {
    let htmlOutput = `<h1 class="article-content__title">${page.title}</h1>`;
    
    if (page.content_sections && page.content_sections.length > 0) {
      page.content_sections.forEach(section => {
        if (section.header || section.content) {
          if (section.header) {
            htmlOutput += `<h2 class="article-content__subtitle">${section.header}</h2>`;
          }
          if (section.content) {
            htmlOutput += renderStrapiBlocks(section.content);
          }
        }

        const mediaField = section.image || section.media || section.picture || section.photo || section.file;
        
        if (mediaField) {
          let mediaHtml = '';
          
          const extractUrl = (mediaObj) => {
            if (!mediaObj) return null;
            let url = null;
            if (mediaObj.attributes && mediaObj.attributes.url) url = mediaObj.attributes.url; // Strapi v4
            else if (mediaObj.url) url = mediaObj.url; // Strapi v5
            if (url && url.startsWith('/')) url = 'http://localhost:1338' + url;
            return url;
          };

          const mediaItems = Array.isArray(mediaField.data) ? mediaField.data 
                           : (mediaField.data ? [mediaField.data] 
                           : (Array.isArray(mediaField) ? mediaField : [mediaField]));

          mediaItems.forEach(item => {
            const url = extractUrl(item);
            if (url) {
              mediaHtml += `<img src="${url}" style="max-width: 100%; max-height: 400px; height: auto; margin: 15px 15px 15px 0; border-radius: 4px; display: inline-block; vertical-align: top;" />`;
            }
          });

          if (mediaHtml) {
            htmlOutput += `<div class="article-media-container">${mediaHtml}</div>`;
          }
        }
      });
    } else {
      htmlOutput += `<p class="article-content__paragraph" style="color: #888;"><i>No content sections added yet.</i></p>`;
    }

    contentArea.innerHTML = htmlOutput;
  }
}

function renderStrapiBlocks(content) {
  if (typeof content === 'string') return `<p class="article-content__paragraph">${content}</p>`;
  
  if (Array.isArray(content)) {
    return content.map(block => {
      if (block.type === 'paragraph') return `<p class="article-content__paragraph">${renderChildren(block.children)}</p>`;
      if (block.type === 'heading') return `<h${block.level} class="article-content__subtitle">${renderChildren(block.children)}</h${block.level}>`;
      
      if (block.type === 'list') {
        const tag = block.format === 'ordered' ? 'ol' : 'ul';
        return `<${tag} class="article-content__list">${renderChildren(block.children)}</${tag}>`;
      }
      
      if (block.type === 'list-item') return `<li>${renderChildren(block.children)}</li>`;
      
      if (block.type === 'image') {
        const img = block.image;
        if (!img) return '';
        
        let imgUrl = img.url;
        if (imgUrl && imgUrl.startsWith('/')) imgUrl = 'http://localhost:1338' + imgUrl;
        
        return `<div class="article-image-wrapper" style="display: inline-block; margin: 15px 15px 15px 0; max-width: 100%; vertical-align: top;">
                  <img src="${imgUrl}" alt="${img.alternativeText || 'Image'}" style="max-width: 100%; height: auto; border-radius: 4px;" />
                </div>`;
      }
      
      return ''; 
    }).join('');
  }
  return '';
}

function renderChildren(children) {
  if (!children) return '';
  return children.map(child => {
    if (child.type === 'text') {
      let text = child.text;
      if (child.bold) text = `<strong>${text}</strong>`;
      if (child.italic) text = `<em>${text}</em>`;
      if (child.underline) text = `<u>${text}</u>`;
      return text;
    }
    
    if (child.type === 'link') {
      const isExternal = child.url.startsWith('http');
      return `<a href="${child.url}" target="${child.target || (isExternal ? '_blank' : '_self')}">
                <strong>${renderChildren(child.children)}</strong>
              </a>`;
    }
    return '';
  }).join('');
}

initializeApp();