# Generate a tiny silent WAV file for music testing
import struct

# WAV header for 1 second of silence, 8-bit mono, 8000 Hz
sample_rate = 8000
num_samples = 800  # 0.1 second
byte_rate = sample_rate  # 8-bit mono = 1 byte/sample
data_size = num_samples

header = b'RIFF'
header += struct.pack('<I', 36 + data_size)  # file size - 8
header += b'WAVE'
header += b'fmt '
header += struct.pack('<I', 16)  # fmt chunk size
header += struct.pack('<H', 1)   # format = PCM
header += struct.pack('<H', 1)   # channels = 1
header += struct.pack('<I', sample_rate)  # sample rate
header += struct.pack('<I', byte_rate)    # byte rate
header += struct.pack('<H', 1)   # block align
header += struct.pack('<H', 8)   # bits per sample
header += b'data'
header += struct.pack('<I', data_size)  # data chunk size
data = b'\x80' * num_samples  # silence (midpoint for 8-bit unsigned)

with open('tests/silent-test.wav', 'wb') as f:
    f.write(header + data)

print(f"Created silent-test.wav: {len(header + data)} bytes")
