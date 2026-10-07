import React, { useRef, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from '../components/Navbar';
import './VisualizationPage.css';

// 3D Heart Component
const Heart = ({ color, isRotating }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (isRotating && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    
    // Heart shape drawing
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2.0, y, x, y);
    shape.bezierCurveTo(x - 3.0, y, x - 3.0, y + 3.5, x - 3.0, y + 3.5);
    shape.bezierCurveTo(x - 3.0, y + 5.5, x - 1.0, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6.0, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5);
    shape.bezierCurveTo(x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y);
    shape.bezierCurveTo(x + 3.0, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSettings = {
      depth: 2,
      bevelEnabled: true,
      bevelSegments: 10,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    
    // Scale it down a bit to fit nicely
    geo.scale(0.3, 0.3, 0.3);
    
    // Rotate to stand upright
    geo.rotateZ(Math.PI);
    
    return geo;
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial 
          color={color}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </mesh>
    </Float>
  );
};

// Particles component for blood flow effect
const Particles = ({ color }) => {
  const pointsRef = useRef();
  
  const particleCount = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.2;
      pointsRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.6} />
    </points>
  );
};

const VisualizationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result || { overallRisk: 45, cadRisk: 30 }; // Demo fallback

  const [isRotating, setIsRotating] = useState(true);
  const [showParticles, setShowParticles] = useState(true);

  const getRiskColor = (risk) => {
    if (risk >= 70) return '#ef4444'; // Red for high
    if (risk >= 30) return '#eab308'; // Yellow for moderate
    return '#5aa9df'; // Blue for low
  };

  const getRiskCategory = (risk) => {
    if (risk >= 70) return { label: 'High Risk', badgeClass: 'badge-danger' };
    if (risk >= 30) return { label: 'Moderate Risk', badgeClass: 'badge-warning' };
    return { label: 'Low Risk', badgeClass: 'badge-success' };
  };

  const riskColor = getRiskColor(result.overallRisk);
  const categoryInfo = getRiskCategory(result.overallRisk);

  return (
    <div className="viz-page">
      <Navbar />
      
      <div className="viz-container">
        {/* 3D Canvas Area */}
        <div className="canvas-wrapper">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <color attach="background" args={['#0a1628']} />
            
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#5aa9df" />
            
            <Environment preset="studio" />
            
            <Heart color={riskColor} isRotating={isRotating} />
            {showParticles && <Particles color={riskColor} />}
            
            <OrbitControls 
              enablePan={false}
              minDistance={3}
              maxDistance={12}
            />
            
            {/* Subtle grid */}
            <gridHelper args={[20, 20, '#1a365d', '#1a365d']} position={[0, -3, 0]} />
          </Canvas>
          
          <div className="controls-panel">
            <button 
              className={`viz-btn ${!isRotating ? 'active' : ''}`}
              onClick={() => setIsRotating(!isRotating)}
            >
              {isRotating ? 'Pause Rotation' : 'Resume Rotation'}
            </button>
            <button 
              className={`viz-btn ${!showParticles ? 'active' : ''}`}
              onClick={() => setShowParticles(!showParticles)}
            >
              Toggle Particles
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="info-panel">
          <div className="info-card">
            <h2>Risk Analysis</h2>
            
            <div className="risk-metrics">
              <div className="metric">
                <span className="metric-label">Overall Risk</span>
                <span className="metric-value" style={{ color: riskColor }}>{result.overallRisk}%</span>
              </div>
              
              <div className="metric">
                <span className="metric-label">CAD Risk</span>
                <span className="metric-value">{result.cadRisk}%</span>
              </div>
            </div>
            
            <div className={`viz-badge ${categoryInfo.badgeClass}`}>
              {categoryInfo.label}
            </div>
            
            <p className="viz-description">
              The 3D heart model is color-coded based on your assessment results. 
              Drag to rotate and scroll to zoom in and out.
            </p>
            
            <div className="info-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate(-1)}
              >
                Back to Results
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/assess')}
              >
                New Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage;
