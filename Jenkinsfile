pipeline {
    agent any

    environment {
        APP_NAME   = "ezops"
        DEPLOY_DIR = "/opt/tomcat/webapps/ezops"
        BACKUP_DIR = "/opt/tomcat/backups/ezops"
        TIMESTAMP  = sh(script: "date +%Y%m%d_%H%M%S", returnStdout: true).trim()
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/loganathr20/EZOps_Netlify.git'
            }
        }

        stage('Backup Existing Site') {
            steps {
                sh '''
                mkdir -p ${BACKUP_DIR}

                if [ -d "${DEPLOY_DIR}" ] && [ "$(ls -A ${DEPLOY_DIR})" ]; then
                    echo "Creating backup..."
                    tar -czf ${BACKUP_DIR}/${APP_NAME}_${TIMESTAMP}.tar.gz -C ${DEPLOY_DIR} .
                else
                    echo "First deployment — no backup required"
                fi
                '''
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                sh '''
                echo "Deploying EZOPS to Tomcat..."

                mkdir -p ${DEPLOY_DIR}
                rm -rf ${DEPLOY_DIR}/*

                rsync -av --exclude='.git' ./ ${DEPLOY_DIR}/
                chmod -R 755 ${DEPLOY_DIR}

                echo "Deployment successful"
                '''
            }
        }
    }

    post {
        success {
            mail to: 'loganathr20@gmail.com',
                 subject: "✅ EZOPS Deployment SUCCESS",
                 body: """
Deployment completed successfully.

App     : EZOPS
Server  : ${env.NODE_NAME}
Time    : ${TIMESTAMP}
URL     : http://localhost:8080/ezops/
"""
        }

        failure {
            echo "❌ Deployment failed — rolling back"

            sh '''
            if ls ${BACKUP_DIR}/*.tar.gz >/dev/null 2>&1; then
                LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/*.tar.gz | head -1)
                echo "Restoring $LATEST_BACKUP"

                rm -rf ${DEPLOY_DIR}/*
                tar -xzf "$LATEST_BACKUP" -C ${DEPLOY_DIR}

                echo "Rollback completed"
            else
                echo "No backup available — rollback skipped"
            fi
            '''

            mail to: 'you@example.com',
                 subject: "❌ EZOPS Deployment FAILED (Rollback Applied)",
                 body: """
Deployment FAILED.

App     : EZOPS
Server  : ${env.NODE_NAME}
Time    : ${TIMESTAMP}
Rollback: Attempted

Check Jenkins logs immediately.
"""
        }
    }
}

