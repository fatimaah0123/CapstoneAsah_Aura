import { useState, useRef, useEffect } from 'react';

const useCamera = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [image, setImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const listCameras = async () => {
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devs.filter(d => d.kind === 'videoinput');
      setDevices(videoDevs);
      if (videoDevs.length > 0) setSelectedDevice(videoDevs[0].deviceId);
    } catch (err) {
      console.error("Gagal akses kamera", err);
    }
  };

  const startCamera = async () => {
    stopCamera();
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          width: 1280,
          height: 720
        }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Gagal membuka kamera.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setImage(canvas.toDataURL('image/png'));
      stopCamera();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImage(null);
    startCamera();
  };

  useEffect(() => {
    listCameras();
    return () => stopCamera();
  }, []);

  return {
    isCameraOpen,
    devices,
    selectedDevice, setSelectedDevice,
    image, setImage,
    videoRef,
    canvasRef,
    fileInputRef,
    startCamera,
    stopCamera,
    takePicture,
    handleFileChange,
    resetImage,
  };
};

export default useCamera;