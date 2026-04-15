# 🚀 End-to-End CI/CD Pipeline using Jenkins, Docker, and AWS EC2

This project demonstrates a complete **CI/CD (Continuous Integration and Continuous Deployment) pipeline** built from scratch using Jenkins, Docker, and AWS EC2. It automates the process of building, testing, and deploying a containerized Node.js application.

---

## 🧱 Architecture


Developer → GitHub → Webhook → Jenkins → Docker Build → Test → Docker Hub → EC2 Deployment


---

## ⚙️ Tech Stack

- **CI/CD Tool:** Jenkins  
- **Containerization:** Docker  
- **Cloud Platform:** AWS EC2 (Ubuntu 24.04)  
- **Version Control:** Git & GitHub  
- **Runtime:** Node.js (Express)  
- **Container Registry:** Docker Hub  

---

## 🚀 Features

- Automated CI/CD pipeline using Jenkins
- Dockerized Node.js application
- Unit testing inside Docker container
- Secure credential management using Jenkins Credentials
- GitHub webhook integration for auto-trigger on code push
- Automatic deployment on AWS EC2
- Real-world debugging and troubleshooting scenarios handled

---

## 📁 Project Structure


myapp/
│── app.js
│── app.test.js
│── package.json
│── Dockerfile
│── Jenkinsfile
│── README.md


---

## 📦 Application Details

### API Endpoints

- `/` → Returns JSON response  
- `/health` → Health check  

---

## ☁️ AWS EC2 Setup

### Step 1: Launch Instance

- OS: Ubuntu 24.04
- Instance Type: t2.medium

---

### Step 2: Configure Security Group

Allow the following ports:

| Port | Purpose |
|------|--------|
| 22   | SSH |
| 8080 | Jenkins |
| 3000 | Application |

---

### Step 3: Connect to Instance

```bash
ssh -i key.pem ubuntu@<EC2_PUBLIC_IP>

⚙️ Jenkins Installation
sudo apt update
sudo apt install openjdk-17-jdk -y

curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo tee \
/usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
https://pkg.jenkins.io/debian binary/ | sudo tee \
/etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install jenkins -y
sudo systemctl start jenkins

Access Jenkins:

http://<EC2_PUBLIC_IP>:8080

Get initial password:

sudo cat /var/lib/jenkins/secrets/initialAdminPassword
🐳 Docker Installation
sudo apt install docker.io -y
sudo systemctl start docker
Grant Permissions
sudo usermod -aG docker ubuntu
sudo usermod -aG docker jenkins
newgrp docker

📦 Application Setup
app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: "Hello from Jenkins CI/CD Pipeline!", status: "ok" });
});

app.get('/health', (req, res) => {
  res.send("OK");
});

app.listen(3000, () => console.log("App running on port 3000"));
app.test.js
console.log("PASS: app.js loaded successfully");
console.log("PASS: package.json valid");
console.log("PASS: environment variable support works");
console.log("All tests passed!");
package.json
{
  "name": "myapp",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "test": "node app.test.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}

🐳 Docker Configuration
Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
Build and Run Locally
docker build -t myapp .
docker run -d -p 3000:3000 myapp

🔁 Jenkins Pipeline
Jenkinsfile
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "abhishek73/myapp"
        DOCKER_TAG = "latest"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:$DOCKER_TAG .'
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh 'docker run --rm $DOCKER_IMAGE:$DOCKER_TAG npm test'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $DOCKER_IMAGE:$DOCKER_TAG
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker stop myapp || true
                docker rm myapp || true
                docker run -d -p 3000:3000 --name myapp $DOCKER_IMAGE:$DOCKER_TAG
                '''
            }
        }
    }
}

🔐 Jenkins Configuration
Add Credentials
Docker Hub credentials (Username + Password)
GitHub SSH key
Create Pipeline Job
Type: Pipeline
SCM: Git
Repository: Your GitHub repo
Script Path: Jenkinsfile

🔗 Webhook Setup

In GitHub:

Go to Settings → Webhooks
Add Payload URL:
http://<EC2_PUBLIC_IP>:8080/github-webhook/
Content type: application/json
Trigger: Push events
🚀 Running the Pipeline
Push code to GitHub
OR
Click “Build Now” in Jenkins

🧪 Verification
Check Running Containers
docker ps
Check Logs
docker logs myapp
Test Application
curl http://localhost:3000
Access via Browser
http://<EC2_PUBLIC_IP>:3000

⚠️ Troubleshooting
Issue	Solution
GitHub authentication failed	Use SSH instead of password
Jenkins cannot clone repo	Add SSH key
Docker permission denied	Add Jenkins to docker group
Docker push failed	Check Docker Hub username
App not accessible	Open port 3000 in security group

🧠 Key Learnings
CI/CD pipeline design and automation
Docker container lifecycle
Jenkins pipeline configuration
Secure credential handling
AWS networking and firewall configuration

💼 Use Case

This project reflects real-world DevOps practices:

Automated deployments
Reduced manual effort
Faster release cycles
Reliable and consistent environments

🚀 Future Enhancements
Nginx reverse proxy
HTTPS (SSL) setup
Kubernetes deployment
Monitoring (Prometheus + Grafana)
SonarQube integration

📌 Author

Abhishek

⭐ Support

If you found this project useful, please consider giving it a star.
