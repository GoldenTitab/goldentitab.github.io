import struct

sample_rate = 8000
num_samples = 800
byte_rate = sample_rate
data_size = num_samples

header = b'RIFF'
header += struct.pack('<I', 36 + data_size)
header += b'WAVE'
header += b'fmt '
header += struct.pack('<I', 16)
header += struct.pack('<H', 1)
header += struct.pack('<H', 1)
header += struct.pack('<I', sample_rate)
header += struct.pack('<I', byte_rate)
header += struct.pack('<H', 1)
header += struct.pack('<H', 8)
header += b'data'
header += struct.pack('<I', data_size)
data = b'\x80' * num_samples

with open('tests/silent-test.wav', 'wb') as f:
    f.write(header + data)

print(f"Created silent-test.wav: {len(header + data)} bytes")
