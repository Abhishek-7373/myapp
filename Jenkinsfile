pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "Abhishek-7373/myapp"
        DOCKER_TAG = "latest"
    }

    stages {

        stage('Checkout') {
            steps {
                git 'git@github.com:Abhishek-7373/myapp.git'
            }
        }

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
