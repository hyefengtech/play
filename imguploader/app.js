// app.js

let compressedImageBlob = null;

document.getElementById('compressButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const qualityInput = document.getElementById('qualityInput');
    const resultImage = document.getElementById('resultImage');
    const downloadButton = document.getElementById('downloadButton');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const quality = parseFloat(qualityInput.value);

        if (isNaN(quality) || quality < 0.1 || quality > 1) {
            alert('압축 품질을 0.1에서 1 사이의 값으로 입력해주세요.');
            return;
        }

        compressedImageBlob = await compressImage(file, quality);

        // 결과 이미지 표시
        const resultImageUrl = URL.createObjectURL(compressedImageBlob);
        resultImage.innerHTML = `<img src="${resultImageUrl}" alt="압축된 이미지">`;

        // 다운로드 버튼 활성화
        downloadButton.disabled = false;
    } else {
        alert('select your image please!');
    }
});

document.getElementById('downloadButton').addEventListener('click', () => {
    if (compressedImageBlob) {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(compressedImageBlob);
        downloadLink.download = 'compressed_image.jpg';
        downloadLink.click();
    }
});
