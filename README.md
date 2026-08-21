# ITID-site Project Setup Guide

Welcome to the ITID-site repository! This guide provides step-by-step instructions to set up the project (both the Strapi backend and the frontend) on a new device.

## Prerequisites
- **Git** installed.
- **Docker Desktop** installed and configured properly.
- **Node.js** (optional, but recommended for frontend tools) and **VS Code**.

---

## Setup Steps

### Step 1: Clone the Repository
Open your terminal and clone the repository to your local machine:
```bash
git clone [https://github.com/YourUsername/ITID-site.git](https://github.com/YourUsername/ITID-site.git)
cd ITID-site
```

### Step 2: Set up the Environment Variables
For security reasons, the `.env` file is excluded from version control. You must create one for the backend to connect to the database.
1. Navigate into the backend server folder: `cd ITIDsite` [^1]
2. Find the `.env.example` file.
3. Make a copy of it and rename the copy to `.env`.
4. Open the new `.env` file and ensure the database credentials match your local setup.

### Step 3: Start Docker (Database & Backend)
Ensure Docker Desktop is running [^2] and hardware virtualization/WSL is fully enabled [^3].
Inside the `ITIDsite` folder (where the `docker-compose.yml` file is located), run the following command to download and start the PostgreSQL database and Strapi container:
```bash
docker compose up -d
```
Wait a moment for the containers to build and initialize.

### Step 4: Import the Project Data(if you have previous data that you want to save)
To populate the database and media assets with the existing project content, you will need the encrypted export file.
1. Place the `.tar.gz.enc` file directly inside the `ITIDsite` folder.
2. Run the import command:
   ```bash
   docker exec -it strapi npm run strapi import -- --file export_20260817112909.tar.gz.enc
   ```
3. When prompted, enter the decryption key/password used when the export was created.
4. Confirm the warning that existing data will be deleted. 

### Step 5: Run the Frontend
1. Navigate into the `web` folder.
2. Open it in VS Code and use the **Live Server** extension to launch the website.
3. Ensure your frontend API configuration is pointing to your local running Strapi instance (typically `http://localhost:1338`).

---

## Troubleshooting & Footnotes

[^1]: **Directory Navigation Error:** If you see `no configuration file provided: not found`, it means you are trying to run Docker commands in the root `ITID-site` folder instead of the backend `ITIDsite` folder. Always ensure your terminal is inside the directory containing the `docker-compose.yml` file.

[^2]: **Docker API Connection Error:** If you see `failed to connect to the docker API...`, it means the Docker Engine isn't running. Simply search for and open the "Docker Desktop" application in Windows and wait for the icon to indicate it is running before executing commands.

[^3]: **Virtualization/WSL Errors:** Docker requires virtualization. If Docker Desktop fails to start with "Virtualization support not detected" or "WSL needs updating":
    - **Fix:** Enable "Virtual Machine Platform" and "Windows Subsystem for Linux" in "Turn Windows features on or off". Enable Virtualization (VT-x/AMD-V) in your PC's BIOS. Finally, update WSL by running `wsl --update` in your terminal and restart your PC.