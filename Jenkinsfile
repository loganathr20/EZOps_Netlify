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
                if [ "$(ls -A ${DEPLOY_DIR})" ]; then
                    echo "Creating backup..."
                    tar -czf ${BACKUP_DIR}/ezops_${TIMESTAMP}.tar.gz -C ${DEPLOY_DIR} .
                else
                    echo "No existing files to backup"
                fi
                '''
            }
        }

        stage('Deploy New Version') {
            steps {
                sh '''
                echo "Deploying new version..."
                rm -rf ${DEPLOY_DIR}/*
                cp -r * ${DEPLOY_DIR}/
                chmod -R 755 ${DEPLOY_DIR}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Tomcat-Deploy-EZOPS-Static deployment successful"
        }

        failure {
            echo "❌ Deployment failed — rolling back"

            sh '''
            LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/*.tar.gz | head -1)
            if [ -f "$LATEST_BACKUP" ]; then
                rm -rf ${DEPLOY_DIR}/*
                tar -xzf $LATEST_BACKUP -C ${DEPLOY_DIR}
                echo "Rollback completed"
            else
                echo "No backup available to rollback"
            fi
            '''
        }
    }
}



