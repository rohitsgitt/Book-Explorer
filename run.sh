#!/bin/bash

echo "🚀 Book Explorer Setup Script"
echo "=============================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Start the services
echo "🔄 Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:3001"
    echo "   MongoDB: mongodb://localhost:27017"
    echo ""
    echo "📚 To populate the database with books, run:"
    echo "   docker-compose exec scraper npm start"
    echo ""
    echo "🛑 To stop all services:"
    echo "   docker-compose down"
else
    echo "❌ Some services failed to start. Check logs with:"
    echo "   docker-compose logs"
fi
