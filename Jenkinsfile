
pipeline {
    agent any

    environment {
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

        stage('Backup Current Site') {
            steps {
                sh '''
                mkdir -p ${BACKUP_DIR}

                if [ -d "${DEPLOY_DIR}" ] && [ "$(ls -A ${DEPLOY_DIR})" ]; then
                    echo "Creating backup..."
                    tar -czf ${BACKUP_DIR}/ezops_${TIMESTAMP}.tar.gz -C ${DEPLOY_DIR} .
                else
                    echo "First deployment — skipping backup"
                fi
                '''
            }
        }

        stage('Deploy New Version') {
            steps {
                sh '''
                echo "Deploying EZOPS static site..."

                mkdir -p ${DEPLOY_DIR}

                rm -rf ${DEPLOY_DIR}/*

                # Copy everything except .git
                rsync -av --exclude='.git' ./ ${DEPLOY_DIR}/

                chmod -R 755 ${DEPLOY_DIR}

                echo "Deployment completed"
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Tomcat-Deploy-EZOPS-Static completed successfully"
        }

        failure {
            echo "❌ Deployment failed"

            sh '''
            if ls ${BACKUP_DIR}/*.tar.gz >/dev/null 2>&1; then
                echo "Rollback backup found — restoring"
                LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/*.tar.gz | head -1)
                rm -rf ${DEPLOY_DIR}/*
                tar -xzf $LATEST_BACKUP -C ${DEPLOY_DIR}
                echo "Rollback completed"
            else
                echo "No backup available — skipping rollback"
            fi
            '''
        }
    }
}



