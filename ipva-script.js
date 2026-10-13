const FIPE = "https://fipe.parallelum.com.br/api/v2/cars";
const ALIQUOTAS_IPVA = { SP: 0.04, RJ: 0.04, MG: 0.04, RS: 0.03, SC: 0.02, BA: 0.025 };

const marca = document.getElementById("ipva-marca");
const modelo = document.getElementById("ipva-modelo");
const ano = document.getElementById("ipva-ano");
const resultadoIpva = document.getElementById("ipva-resultado");

async function consultarFipe(caminho) {
    const response = await fetch(`${FIPE}${caminho}`);
    if (!response.ok) throw new Error("Erro ao consultar a FIPE");
    return response.json();
}

function resetar(select, rotulo, itens = []) {
    select.replaceChildren(new Option(rotulo, ""), ...itens.map((i) => new Option(i.name, i.code)));
    select.disabled = itens.length === 0;
}

async function carregar(select, caminho, rotulo) {
    try {
        resetar(select, rotulo, await consultarFipe(caminho));
    } catch (erro) {
        resultadoIpva.textContent = erro.message;
    }
}

marca.addEventListener("change", () => {
    resetar(modelo, "Modelo");
    resetar(ano, "Ano");
    if (marca.value) carregar(modelo, `/brands/${marca.value}/models`, "Modelo");
});

modelo.addEventListener("change", () => {
    resetar(ano, "Ano");
    if (modelo.value) carregar(ano, `/brands/${marca.value}/models/${modelo.value}/years`, "Ano");
});

document.getElementById("ipva-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const cep = document.getElementById("ipva-cep").value.replace(/\D/g, "");

    if (cep.length !== 8) {
        resultadoIpva.textContent = "CEP deve conter 8 dígitos";
        return;
    }

    try {
        const [{ uf }, veiculo] = await Promise.all([
            buscarCep(cep),
            consultarFipe(`/brands/${marca.value}/models/${modelo.value}/years/${ano.value}`),
        ]);
        const aliquota = ALIQUOTAS_IPVA[uf];
        if (!aliquota) throw new Error(`Alíquota de IPVA não cadastrada para ${uf}`);

        const fipe = Number(veiculo.price.replace(/[^\d,]/g, "").replace(",", "."));
        resultadoIpva.textContent = `${veiculo.model} ${veiculo.modelYear} — FIPE ${brl(fipe)} — alíquota ${aliquota * 100}% (${uf}) — IPVA anual: ${brl(fipe * aliquota)}`;
    } catch (erro) {
        resultadoIpva.textContent = erro.message;
    }
});

carregar(marca, "/brands", "Marca");
