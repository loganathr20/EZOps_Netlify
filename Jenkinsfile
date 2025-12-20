pipeline {
    agent any

    environment {
        APP_NAME   = "ezops"
        DEPLOY_DIR = "/opt/tomcat/webapps/ezops"
        BACKUP_DIR = "/opt/tomcat/backups/ezops"
        TIMESTAMP  = sh(script: "date +%Y%m%d_%H%M%S", returnStdout: true).trim()
    }

    stages {

        /* -------------------------------------------------
           CLEAN JENKINS WORKSPACE
           Ensures latest Git content only
        ------------------------------------------------- */
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        /* -------------------------------------------------
           CHECKOUT LATEST CODE (develop branch)
        ------------------------------------------------- */
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        /* -------------------------------------------------
           VERIFY GIT CONTENT (DEBUG / SAFETY)
        ------------------------------------------------- */
        stage('Verify Source Content') {
            steps {
                sh '''
                echo "Latest commit:"
                git log -1 --oneline

                echo "Repository structure:"
                ls -la

                echo "Reports folder from Git:"
                ls -la Reports || echo "Reports folder not found in repo"
                '''
            }
        }

        /* -------------------------------------------------
           BACKUP CURRENT DEPLOYMENT (OPTIONAL SAFETY)
        ------------------------------------------------- */
        stage('Backup Existing Deployment') {
            steps {
                sh '''
                mkdir -p ${BACKUP_DIR}

                if [ -d "${DEPLOY_DIR}" ] && [ "$(ls -A ${DEPLOY_DIR})" ]; then
                    echo "Creating backup..."
                    tar -czf ${BACKUP_DIR}/${APP_NAME}_${TIMESTAMP}.tar.gz -C ${DEPLOY_DIR} .
                else
                    echo "No existing deployment — skipping backup"
                fi
                '''
            }
        }

        /* -------------------------------------------------
           STOP TOMCAT (IMPORTANT FOR FULL CLEAN)
        ------------------------------------------------- */
        stage('Stop Tomcat') {
            steps {
                sh '''
                echo "Stopping Tomcat..."
                sudo systemctl stop tomcat
                '''
            }
        }

        /* -------------------------------------------------
           FULL CLEAN DEPLOYMENT (INCLUDING REPORTS)
        ------------------------------------------------- */
        stage('Clean & Deploy from Git') {
            steps {
                sh '''
                echo "Removing old deployment completely..."
                rm -rf ${DEPLOY_DIR}

                echo "Deploying fresh content from Git..."
                mkdir -p ${DEPLOY_DIR}

                rsync -av \
                    --exclude='.git' \
                    --exclude='Jenkinsfile' \
                    ./ ${DEPLOY_DIR}/

                chmod -R 755 ${DEPLOY_DIR}

                echo "Deployment content:"
                ls -la ${DEPLOY_DIR}
                '''
            }
        }

        /* -------------------------------------------------
           CLEAR TOMCAT CACHE (CRITICAL)
        ------------------------------------------------- */
        stage('Clear Tomcat Cache') {
            steps {
                sh '''
                echo "Clearing Tomcat cache..."
                rm -rf /opt/tomcat/work/Catalina/*
                '''
            }
        }

        /* -------------------------------------------------
           START TOMCAT
        ------------------------------------------------- */
        stage('Start Tomcat') {
            steps {
                sh '''
                echo "Starting Tomcat..."
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
EZOPS CLEAN Deployment Successful

App       : EZOPS
Branch    : ${env.GIT_BRANCH}
Job       : ${env.JOB_NAME}
Build     : #${env.BUILD_NUMBER}
Time      : ${TIMESTAMP}

Deployed EXACTLY from Git.
Reports folder was cleaned & redeployed.

URL:
http://localhost:8080/ezops/
"""
        }

        failure {
            echo "❌ Deployment failed — attempting rollback"

            sh '''
            if ls ${BACKUP_DIR}/*.tar.gz >/dev/null 2>&1; then
                LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/*.tar.gz | head -1)

                sudo systemctl stop tomcat
                rm -rf ${DEPLOY_DIR}
                mkdir -p ${DEPLOY_DIR}
                tar -xzf "$LATEST_BACKUP" -C ${DEPLOY_DIR}
                sudo systemctl start tomcat
            else
                echo "No backup available — rollback skipped"
            fi
            '''

            mail to: 'loganathr20@gmail.com',
                 subject: "❌ EZOPS Deployment FAILED (Rollback Attempted)",
                 body: """
EZOPS Deployment FAILED

App     : EZOPS
Branch  : ${env.GIT_BRANCH}
Build   : #${env.BUILD_NUMBER}
Time    : ${TIMESTAMP}

Rollback was attempted.
Check Jenkins logs immediately.
"""
        }
    }
}



