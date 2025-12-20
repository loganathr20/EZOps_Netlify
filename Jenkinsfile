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

        stage('Backup Existing Site') {
            steps {
                sh '''
                mkdir -p ${BACKUP_DIR}

                if [ -d "${DEPLOY_DIR}" ] && [ "$(ls -A ${DEPLOY_DIR})" ]; then
                    echo "Creating backup..."
                    tar -czf ${BACKUP_DIR}/${APP_NAME}_${TIMESTAMP}.tar.gz -C ${DEPLOY_DIR} .
                else
                    echo "First deployment — skipping backup"
                fi
                '''
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                sh '''
                echo "Deploying EZOPS static site..."

                mkdir -p ${DEPLOY_DIR}
                rm -rf ${DEPLOY_DIR}/*

                rsync -av --delete --exclude='.git' ./ ${DEPLOY_DIR}/
                chmod -R 755 ${DEPLOY_DIR}

                echo "Deployment completed successfully"
                '''
            }
        }

        /* -------------------------------------------------
           RESTART TOMCAT (ADDED)
        ------------------------------------------------- */
        stage('Restart Tomcat') {
            steps {
                sh '''
                echo "Restarting Tomcat..."
                sudo systemctl restart tomcat
                sleep 10
                systemctl is-active tomcat
                '''
            }
        }
    }

    post {

        success {
            mail to: 'loganathr20@gmail.com',
                 subject: "✅ EZOPS Deployment SUCCESS",
                 body: """
EZOPS Deployment Successful

App       : EZOPS
Branch    : ${env.GIT_BRANCH}
Job       : ${env.JOB_NAME}
Build     : #${env.BUILD_NUMBER}
Node      : ${env.NODE_NAME}
Time      : ${TIMESTAMP}

URL:
http://localhost:8080/ezops/
"""
        }

        failure {
            echo "❌ Deployment failed — starting rollback"

            sh '''
            if ls ${BACKUP_DIR}/*.tar.gz >/dev/null 2>&1; then
                LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/*.tar.gz | head -1)
                echo "Restoring backup: $LATEST_BACKUP"

                rm -rf ${DEPLOY_DIR}/*
                tar -xzf "$LATEST_BACKUP" -C ${DEPLOY_DIR}

                echo "Rollback completed"
                sudo systemctl restart tomcat
            else
                echo "No backup found — rollback skipped"
            fi
            '''

            mail to: 'loganathr20@gmail.com',
                 subject: "❌ EZOPS Deployment FAILED (Rollback Executed)",
                 body: """
EZOPS Deployment FAILED

App       : EZOPS
Branch    : ${env.GIT_BRANCH}
Job       : ${env.JOB_NAME}
Build     : #${env.BUILD_NUMBER}
Time      : ${TIMESTAMP}

Rollback was attempted.
Tomcat restarted.
Check Jenkins logs immediately.
"""
        }
    }
}



