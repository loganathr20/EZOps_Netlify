pipeline {
    agent any

    environment {
        APP_NAME   = "ezops"
        DEPLOY_DIR = "/opt/tomcat/webapps/ezops"
        BACKUP_DIR = "/opt/tomcat/backups/ezops"
        TIMESTAMP  = sh(script: "date +%Y%m%d_%H%M%S", returnStdout: true).trim()
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backup Existing Deployment') {
            steps {
                sh '''
                mkdir -p ${BACKUP_DIR}
                if [ -d "${DEPLOY_DIR}" ] && [ "$(ls -A ${DEPLOY_DIR})" ]; then
                    tar -czf ${BACKUP_DIR}/${APP_NAME}_${TIMESTAMP}.tar.gz -C ${DEPLOY_DIR} .
                fi
                '''
            }
        }

        stage('Stop Tomcat') {
            steps {
                sh 'sudo systemctl stop tomcat'
            }
        }

        stage('Clean & Deploy from Git') {
            steps {
                sh '''
                rm -rf ${DEPLOY_DIR}
                mkdir -p ${DEPLOY_DIR}

                rsync -av \
                  --exclude='.git' \
                  --exclude='Jenkinsfile' \
                  ./ ${DEPLOY_DIR}/

                chmod -R 755 ${DEPLOY_DIR}
                '''
            }
        }

        stage('Start Tomcat') {
            steps {
                sh '''
                sudo systemctl start tomcat
                sleep 10
                systemctl is-active tomcat
                '''
            }
        }
    }

    post {
        success {
            mail to: 'loganathr20@gmail.com',
                 subject: "✅ EZOPS CLEAN Deployment SUCCESS",
                 body: """
Deployment Successful

App   : EZOPS
Build : #${env.BUILD_NUMBER}
Time  : ${TIMESTAMP}

http://localhost:8080/ezops/
"""
        }

        failure {
            sh '''
            if ls ${BACKUP_DIR}/*.tar.gz >/dev/null 2>&1; then
                LATEST=$(ls -t ${BACKUP_DIR}/*.tar.gz | head -1)
                sudo systemctl stop tomcat
                rm -rf ${DEPLOY_DIR}
                mkdir -p ${DEPLOY_DIR}
                tar -xzf "$LATEST" -C ${DEPLOY_DIR}
                sudo systemctl start tomcat
            fi
            '''
        }
    }
}



