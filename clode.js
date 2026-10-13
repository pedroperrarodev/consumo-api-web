const ALIQUOTAS = {
    "São Paulo": 0.015,
    "Rio de Janeiro": 0.012,
};
const ALIQUOTA_PADRAO = 0.01;

const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

async function buscarCep(cep) {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();
    if (dados.erro) throw new Error("CEP não encontrado");
    return dados;
}

document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const cep = document.getElementById("cep").value.replace(/\D/g, "");
    const valor = Number(document.getElementById("valor").value);
    const resultado = document.getElementById("resultado");

    if (cep.length !== 8) {
        resultado.textContent = "CEP deve ter 8 dígitos";
        return;
    }

    try {
        const { logradouro, localidade, uf } = await buscarCep(cep);
        const aliquota = ALIQUOTAS[localidade] ?? ALIQUOTA_PADRAO;
        const iptu = valor * aliquota;
        resultado.textContent = `${logradouro}, ${localidade}/${uf} — alíquota ${aliquota * 100}% — IPTU anual: ${brl(iptu)}`;
    } catch (erro) {
        resultado.textContent = erro.message;
    }
});
