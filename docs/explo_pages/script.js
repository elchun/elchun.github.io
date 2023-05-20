function measurePingTime() {
  const startTime = new Date().getTime();

  const img = new Image();
  img.onload = function() {
    const endTime = new Date().getTime();
    const pingTime = endTime - startTime;
    document.getElementById('ping-result').textContent = `Ping Time: ${pingTime}ms`;

    setTimeout(measurePingTime, 500); // Update ping time every 5 seconds
  };

  img.onerror = function() {
    document.getElementById('ping-result').textContent = 'Error measuring ping time';
    setTimeout(measurePingTime, 500); // Retry measurement every 5 seconds
  };

  img.src = 'https://www.google.com/favicon.ico?' + startTime;
}

measurePingTime();
