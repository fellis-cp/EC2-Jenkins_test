pipeline {
  agent any

  // Cek GitHub tiap ~2 menit; kalau ada commit baru, pipeline jalan
  triggers {
    pollSCM('H/2 * * * *')
  }

  environment {
    IMAGE = "demo-app:${BUILD_NUMBER}"
  }

  stages {
    stage('Test') {
      steps {
        sh 'npm ci'
        sh 'npm test'
      }
    }

    stage('Build image') {
      steps {
        sh 'docker build -t $IMAGE -t demo-app:latest .'
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          docker rm -f demo-app || true
          docker run -d --name demo-app --restart unless-stopped -p 80:8080 demo-app:latest
        '''
      }
    }

    stage('Verify') {
      steps {
        sh '''
          sleep 3
          curl -f http://localhost/health
        '''
      }
    }
  }

  post {
    success { echo 'Deploy berhasil' }
    failure { echo 'Pipeline gagal, cek Console Output' }
  }
}
