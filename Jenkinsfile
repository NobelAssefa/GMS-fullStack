pipeline {
  agent any

  stages {
    stage('Build Backend') {
      steps {
        dir('Backend') {
          sh 'docker build -t backend .'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('FrontEnd') {
          sh 'docker build -t frontend .'
        }
      }
    }

    stage('Run Everything') {
      steps {
        sh 'docker-compose up -d --build'
      }
    }
  }

  post {
    failure {
      echo '❌ Build failed!'
    }
    success {
      echo '✅ Build and deployment successful!'
    }
  }
}
