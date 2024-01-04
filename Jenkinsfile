#!groovy​
pipeline {
  agent {
    label 'k5'
  }

  options {
    buildDiscarder logRotator(
      artifactDaysToKeepStr: '',
      artifactNumToKeepStr: '',
      daysToKeepStr: '',
      numToKeepStr: '10'
    )
  }

  environment {
    CONTAINER_NAME = "ck-invoicexml"
    VERSION = "0.1.22"
    PORT = "44473"
    IMAGE = "registry.gitlab.com/alkosto/microservices/${CONTAINER_NAME}:${VERSION}"
    EMAIL_TO = "miguel.caro@colcomercio.com.co"
    SONAR_RUNNER = "/var/jenkins_home/tools/hudson.plugins.sonar.SonarRunnerInstallation/SonarQubeScanner/bin"
  }

  stages {
    stage ('Run SonarQube Analysis') {
      steps {
        withSonarQubeEnv ('sonarDocker') {
          sh "${env.SONAR_RUNNER}/sonar-scanner -X"
        }
      }
    }

    // stage("Quality Gate") {
    //   steps {
    //     timeout(time: 60, unit: 'SECONDS') {
    //       waitForQualityGate abortPipeline: true
    //     }
    //   }
    // }

    stage('Build Image') {
      steps {
        sh "docker rmi -f ${IMAGE}"
        sh "docker build -t ${IMAGE} ."
      }
    }

    stage('Run Container') {
      steps {
        dir ('devops') {
          sh "chmod +x run.sh"
          sh "./run.sh ${CONTAINER_NAME} ${PORT} ${IMAGE}"
        }
      }
    }

    stage("Run Unit Tests") {
      steps {
        sh "docker exec ${CONTAINER_NAME} npm test"
      }
    }

    stage('Push Registry') {
      steps {
        sh "docker login registry.gitlab.com"
        sh "docker push ${IMAGE}"
      }
    }

    stage("Delivery to QA") {
      steps {
        dir ('devops') {
          sh "ansible -m ping -i hosts k4"
          sh "ansible-playbook playbook.yml -i hosts -e CONTAINER_NAME=${CONTAINER_NAME} -e VERSION=${VERSION} -e PORT=${PORT} -e IMAGE=${IMAGE}"
        }
      }
    }
  }

  post {
    always {
      sh "docker stop ${CONTAINER_NAME}"
      sh "docker rm ${CONTAINER_NAME}"
      sh "docker rmi -f ${IMAGE}"

      emailext body: '${DEFAULT_CONTENT}',
      to: env.EMAIL_TO,
      subject: '${DEFAULT_SUBJECT}'
    }
  }
}
