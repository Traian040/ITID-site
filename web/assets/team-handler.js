
let allTeams = [];

async function initializeTeams() {
  try {
    const url = 'http://localhost:1338/api/teams?populate[profiles][populate]=*';
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Strapi Error ${response.status}`);
    
    const json = await response.json();
    let fetchedTeams = json.data;

    if (fetchedTeams && fetchedTeams.length > 0) {
      
      fetchedTeams.sort((a, b) => {
        const teamA = (a.attributes || a).name?.toLowerCase() || "";
        const teamB = (b.attributes || b).name?.toLowerCase() || "";
        
        if (teamA === 'team') return -1;
        if (teamB === 'team') return 1;
        return 0;
      });

      allTeams = fetchedTeams;

      renderSidebar(allTeams);
      
      renderTeamContent(allTeams[0]); 
    } else {
      document.getElementById('dynamic-sidebar').innerHTML = `<li><p style="padding-left: 1rem; color: #888;">No teams found.</p></li>`;
      document.getElementById('dynamic-content').innerHTML = `<p class="article-content__paragraph">No team data is currently available.</p>`;
    }

  } catch (error) {
    console.error("Failed to load teams:", error);
    document.getElementById('dynamic-sidebar').innerHTML = `<li><a href="#">Error loading</a></li>`;
    document.getElementById('dynamic-content').innerHTML = `<p class="article-content__paragraph" style="color:red;">Error fetching data. Check Strapi connection.</p>`;
  }
}

function renderSidebar(teams) {
  const sidebarMenu = document.getElementById('dynamic-sidebar');
  if (!sidebarMenu) return;
  sidebarMenu.innerHTML = ''; 

  teams.forEach(team => {
    const teamData = team.attributes || team; 
    const teamName = teamData.name || "Unnamed Team";

    const li = document.createElement('li');
    const a = document.createElement('a');
    
    a.textContent = teamName;
    a.href = '#';
    a.onclick = (e) => {
      e.preventDefault();
      renderTeamContent(team);
    };
    
    li.appendChild(a);
    sidebarMenu.appendChild(li);
  });
}

function renderTeamContent(team) {
  const teamData = team.attributes || team;
  const teamName = teamData.name || "Unnamed Team";
  
  const sidebarLinks = document.querySelectorAll('#dynamic-sidebar a');
  sidebarLinks.forEach(link => {
    if (link.textContent === teamName) {
      link.classList.add('active-sidebar-btn');
    } else {
      link.classList.remove('active-sidebar-btn');
    }
  });

  const heroSubtitleEl = document.getElementById('hero-subtitle');
  if (heroSubtitleEl) {
    heroSubtitleEl.textContent = teamName;
  }

  const contentArea = document.getElementById('dynamic-content');
  if (!contentArea) return;
  
  let htmlOutput = `<h1 class="article-content__title">${teamName}</h1>`;
  
  let profiles = [];
  if (teamData.profiles) {
    profiles = teamData.profiles.data || teamData.profiles;
  }

  if (profiles && profiles.length > 0) {
    htmlOutput += `<div class="profiles-grid">`;
    
    profiles.forEach(profileWrapper => {
      const profile = profileWrapper.attributes || profileWrapper;
      
      const name = profile.name || profile.Name || "Unknown Member";
      const title = profile.title || profile.role || profile.position || profile.Title || "";
      const email = profile.email || profile.Email || "";
      const phone = profile.phone || profile.Phone || profile.phoneNumber || "";
      const linkedin = profile.linkedin || profile.LinkedIn || profile.linkedIn || "";
      const bio = profile.bio || profile.description || profile.Bio || profile.Description || "";

      let imageUrl = "";
      const imgField = profile.profile_picture;
      
      if (imgField) {
        if (imgField.data && imgField.data.attributes && imgField.data.attributes.url) {
          imageUrl = imgField.data.attributes.url;
        } else if (imgField.data && Array.isArray(imgField.data) && imgField.data.length > 0) {
          imageUrl = imgField.data[0].attributes.url;
        } else if (imgField.url) {
          imageUrl = imgField.url;
        }
        
        if (imageUrl && imageUrl.startsWith('/')) {
          imageUrl = 'http://localhost:1338' + imageUrl;
        }
      }

      htmlOutput += `<div class="profile-card">`;
      
      if (imageUrl) {
        htmlOutput += `<img src="${imageUrl}" alt="${name}'s profile picture" class="profile-image" />`;
      }
      
      htmlOutput += `<h3>${name} ${title ? `<span class="profile-title">- ${title}</span>` : ''}</h3>`;
      
      if (email) {
        htmlOutput += `<p class="profile-detail"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>`;
      }
      if (phone) {
        htmlOutput += `<p class="profile-detail"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>`;
      }
      if (linkedin) {
        htmlOutput += `<p class="profile-detail"><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank">View Profile</a></p>`;
      }
      
      if (bio) {
        htmlOutput += `<div class="profile-bio">${bio}</div>`;
      }

      htmlOutput += `</div>`; 
    });
    
    htmlOutput += `</div>`; 
  } else {
    htmlOutput += `<p class="article-content__paragraph" style="color: #888;"><i>No profiles have been assigned to this team yet.</i></p>`;
  }

  contentArea.innerHTML = htmlOutput;
}

initializeTeams();