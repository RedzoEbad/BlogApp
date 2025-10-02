pipeline {
    agent any
    tools {
        nodejs "NodeJS"   
    }
    stages {
        stage('Install') {
            steps {
                sh 'npm install --legacy-peer-deps'
            }
        }
        stage('Test Frontend') {
            steps {
                sh 'cd frontend && npm test -- --coverage'
            }
        }
        stage('Test Backend') {
            steps {
                sh 'cd backend && npm test -- --coverage'
            }
        }
        stage('Publish Coverage') {
            steps {
                publishHTML(target: [
                    reportName: 'Coverage Report',
                    reportDir: 'frontend/coverage/lcov-report',
                    reportFiles: 'index.html'
                ])
            }
        }
    }
    post {
        always {
            junit '**/junit.xml'
        }
        failure {
            echo '❌ Tests failed. Deployment halted.'
        }
        success {
            echo '✅ All tests passed. Ready for deployment.'
        }
    }
}
