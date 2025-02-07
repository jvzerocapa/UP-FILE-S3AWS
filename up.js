
AWS.config.update({
    accessKeyId: "AKIAYQNJSUDTUAHNAZAL",
    secretAccessKey: "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",
    region: "sa-east-1" 
});



// Criar instância do S3
const s3 = new AWS.S3();

document.getElementById("uploadButton").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecione um arquivo antes de enviar.");
        return;
    }

    uploadFile(file);
});

document.getElementById("listFilesButton").addEventListener("click", listFiles);

function uploadFile(file) {
    const params = {
        Bucket: "testeadpv2", 
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
        }
    });
}

function listFiles() {
    const params = {
        Bucket: "testeadpv2" 
    };

    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.error("Erro ao listar arquivos:", err);
            alert("Erro ao listar arquivos.");
        } else {
            const fileList = document.getElementById("fileList");
            fileList.innerHTML = ""; 

            data.Contents.forEach(file => {
                const fileUrl = `https://${params.Bucket}.s3.amazonaws.com/${file.Key}`;
                const listItem = document.createElement("li");
                const link = document.createElement("a");

                link.href = fileUrl;
                link.textContent = file.Key;
                link.target = "_blank";

                listItem.appendChild(link);
                fileList.appendChild(listItem);
            });

            console.log("Arquivos listados com sucesso!", data.Contents);
        }
    });
}