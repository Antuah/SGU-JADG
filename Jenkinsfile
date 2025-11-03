pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        PROJECT_NAME = 'sgu-jadg-10a'
        DOCKER_COMPOSE = '/usr/local/bin/docker-compose'
        DOCKER_CONFIG = "${env.HOME}/.jenkins/.docker"
        PATH = "/usr/local/bin:${env.PATH}"
    }
    
    stages {
        stage('Cleanup') {
            steps {
                script {
                    echo 'Limpiando contenedores y recursos previos...'
                    sh '''
                        # intentar bajar servicios y eliminar contenedores huérfanos
                        ${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} down -v --remove-orphans || true
                        # forzar eliminación de contenedores con nombres conocidos (en caso de conflicto)
                        docker rm -f sgu-database sgu-backend sgu-frontend || true
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
                        ${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} build --no-cache
                    '''
                }
            }
        }
        
        stage('Start Services') {
            steps {
                script {
                    echo 'Iniciando servicios con Docker Compose...'
                    sh '''
                        # asegurar que no haya contenedores conflictivos
                        docker rm -f sgu-database sgu-backend sgu-frontend || true
                        ${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} up -d
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
        
        stage('Health Check') {
            steps {
                script {
                    echo 'Verificando health de los servicios...'
                    sh '''
                        echo "Verificando Base de Datos..."
                        docker exec sgu-database mysqladmin ping -h localhost -u root -proot_pass || exit 1
                        
                        echo "Verificando Backend API..."
                        curl -f http://localhost:8081/api/users || exit 1
                        
                        echo "Verificando Frontend..."
                        curl -f http://localhost:5173 || exit 1
                        
                        echo "Todos los servicios funcionan correctamente"
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline ejecutado exitosamente'
            echo 'Servicios desplegados:'
            echo '  - Frontend: http://localhost:5173'
            echo '  - Backend API: http://localhost:8081/api/users'
            echo '  - Base de datos MySQL: localhost:3307'
            echo ''
            sh 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"'
        }
        failure {
            echo 'El pipeline fallo. Revisando logs...'
            sh '''
                echo "=== LOGS COMPLETOS ==="
                ${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} logs
                echo "\\n=== Limpiando recursos ==="
                ${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} down -v || true
            '''
        }
        always {
            echo 'Pipeline finalizado'
        }
    }
}
