
AWS.config.update({
    accessKeyId: "accesKeyAqui",
    secretAccessKey: "SenhadaAccesKeyAqui",
    region: "sa-east-1"
});

// Criar instância do S3
const s3 = new AWS.S3();
const bucketName = "NomeDoBucketAqui";

document.getElementById("uploadButton").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecione um arquivo antes de enviar.");
        return;
    }

    uploadFile(file);
});

document.getElementById("viewAllFilesButton").addEventListener("click", displayFilesOnPage);

function uploadFile(file) {
    const params = {
        Bucket: bucketName,
        Key: file.name,
        Body: file,
        ACL: "public-read"
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error("Erro no upload:", err);
            alert("Erro ao enviar o arquivo.");
        } else {
            console.log("Upload bem-sucedido! URL:", data.Location);
            alert("Arquivo enviado com sucesso!\n" + data.Location);
            displayFilesOnPage(); // Atualiza a lista após upload
        }
    });
}

function displayFilesOnPage() {
    const params = {
        Bucket: bucketName
    };

    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.error("Erro ao listar arquivos:", err);
            alert("Erro ao listar arquivos.");
        } else {
            const fileDisplay = document.getElementById("fileDisplay");
            fileDisplay.innerHTML = ""; // Limpa antes de atualizar

            if (data.Contents.length === 0) {
                fileDisplay.innerHTML = "<p>Nenhum arquivo encontrado.</p>";
                return;
            }

            data.Contents.forEach(file => {
                const fileUrl = `https://${bucketName}.s3.amazonaws.com/${file.Key}`;
                const fileElement = document.createElement("div");
                fileElement.style.marginBottom = "10px";

                if (file.Key.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
                    // Exibe imagens na página
                    const img = document.createElement("img");
                    img.src = fileUrl;
                    img.alt = file.Key;
                    img.style.maxWidth = "200px";
                    img.style.display = "block";
                    fileElement.appendChild(img);
                } else {
                    // Exibe link para outros arquivos
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.textContent = file.Key;
                    link.target = "_blank";
                    fileElement.appendChild(link);
                }

                fileDisplay.appendChild(fileElement);
            });

            console.log("Arquivos exibidos com sucesso!", data.Contents);
        }
    });
}
