pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        PROJECT_NAME = 'sgu-jadg-10a'
    }
    
    stages {
        stage('Cleanup') {
            steps {
                script {
                    echo 'Limpiando contenedores y recursos previos...'
                    sh '''
                        docker-compose -f ${DOCKER_COMPOSE_FILE} down -v || true
                        docker system prune -f || true
                    '''
                }
            }
        }
        
        stage('Build Images') {
            steps {
                script {
                    echo 'Construyendo imágenes Docker...'
                    sh '''
                        docker-compose -f ${DOCKER_COMPOSE_FILE} build --no-cache
                    '''
                }
            }
        }
        
        stage('Start Services') {
            steps {
                script {
                    echo 'Iniciando servicios con Docker Compose...'
                    sh '''
                        docker-compose -f ${DOCKER_COMPOSE_FILE} up -d
                    '''
                }
            }
        }
        
        stage('Wait for Services') {
            steps {
                script {
                    echo 'Esperando que los servicios estén listos...'
                    sh '''
                        echo "Esperando base de datos..."
                        sleep 30
                        echo "Esperando backend..."
                        sleep 20
                        echo "Esperando frontend..."
                        sleep 10
                    '''
                }
            }
        }
        
        stage('Verify Services') {
            steps {
                script {
                    echo 'Verificando que los servicios estén corriendo...'
                    sh '''
                        docker ps
                        echo "\\n=== Logs del Frontend ==="
                        docker logs sgu-frontend --tail 50 || true
                        echo "\\n=== Logs del Backend ==="
                        docker logs sgu-backend --tail 50 || true
                        echo "\\n=== Logs de la Base de Datos ==="
                        docker logs sgu-database --tail 50 || true
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo '¡Pipeline ejecutado exitosamente!'
            echo 'Frontend disponible en: http://localhost:5173'
            echo 'Backend disponible en: http://localhost:8081'
            echo 'Base de datos disponible en: localhost:3306'
        }
        failure {
            echo 'El pipeline falló. Revisando logs...'
            sh '''
                docker-compose -f ${DOCKER_COMPOSE_FILE} logs
            '''
        }
        always {
            echo 'Limpieza finalizada'
        }
    }
}
