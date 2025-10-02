pipeline {
    agent any

    environment {
        PATH = "${tool 'NodeJS'}/bin:${env.PATH}"  // inject NodeJS into PATH
    }

    stages {
        stage('Install Frontend') {
            steps {
                dir('BlogAppFront') {
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('BlogAppFront') {
                    sh 'npm test -- --watchAll=false --ci'
                }
            }
        }

        stage('Install Backend') {
            steps {
                dir('server') {
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('server') {
                    sh 'npm test'
                }
            }
        }

        stage('Publish Coverage') {
            steps {
                junit '**/junit.xml'
            }
        }

        stage('Deploy with Docker') {
            steps {
                echo "🚀 Starting deployment using Docker Compose..."
                sh '''
                  docker compose -f docker-compose.yml down
                  docker compose -f docker-compose.yml up -d --build
                '''
            }
        }
    }

    post {
        failure {
            echo "❌ Tests failed. Deployment halted."
        }
        success {
            echo "✅ All tests passed! Deployment complete."
        }
    }
}
