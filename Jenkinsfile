pipeline {
    agent any

    tools {
        nodejs "NodeJS"  // from Jenkins tool config
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
    }

    post {
        failure {
            echo "❌ Tests failed. Deployment halted."
        }
        success {
            echo "✅ All tests passed! Ready for deployment."
        }
    }
}
