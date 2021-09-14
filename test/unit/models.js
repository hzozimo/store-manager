const productsModel = require('../../models/productsModel');
const salesModel = require('../../models/salesModel');
const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient, objectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const getConnection = require('./mockConnection');

const productTest = { name: "Produto Silva", quantity: 10 };


describe('Encontra um produto pelo nome', () => {
  let mockConnection;

  beforeEach(async () => {
    mockConnection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(mockConnection);
    const insertProduct = await productsModel.createProduct(productTest);
  });

  afterEach(async () => {
    await mockConnection.db('StoreManager').collection('products').deleteMany({});
    MongoClient.connect.restore();
  });

  it('retorna null quando não há produto cadastrado com o nome fornecido', async () => {
    const notListedProduct = { name: "Not Listed", quantity: 10 };
    const response = await productsModel.findProductByName(notListedProduct.name);

    expect(response).to.be.null;
  })
  describe('Retorna o produto se ele existir', () => {

    it('é um objeto', async () => {
      const response = await productsModel.findProductByName(productTest.name);
      expect(response).to.be.an('object');
    })

    it('possui a chave "name"', async () =>{
      const response = await productsModel.findProductByName(productTest.name);
      expect(response).to.be.haveOwnProperty('name');
    })

    it('possui a chave "quantity"', async () =>{
      const response = await productsModel.findProductByName(productTest.name);
      expect(response).to.haveOwnProperty('quantity');
    })

    it('possui o mesmo nome do produto pesquisado', async () => {
      const response = await productsModel.findProductByName(productTest.name);
      expect(response.name).to.be.equal(productTest.name);
    })

  })
})

describe('Quando adiciona um produto, retorna:', ()=>{
  let mockConnection;

  beforeEach(async () => {
    mockConnection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(mockConnection);
    // const insertProduct = await productsModel.createProduct(productTest);
  });

  afterEach(async () => {
    await mockConnection.db('StoreManager').collection('products').deleteMany({});
    MongoClient.connect.restore();
  });

  it('Um objeto', async ()=>{
    const insertProduct = await productsModel.createProduct(productTest);
    expect(insertProduct).to.be.an('object');
  })

  it('Que possui o mesmo nome do produto inserido', async () => {
    const insertProduct = await productsModel.createProduct(productTest);
    expect(insertProduct.name).to.be.equal(productTest.name);
  })

  it('Que possui a mesma quantidade do produto inserido', async () => {
    const insertProduct = await productsModel.createProduct(productTest);
    expect(insertProduct.quantity).to.be.equal(productTest.quantity);
  })

  it('Que possui uma id gerada automaticamente', async () => {
    const insertProduct = await productsModel.createProduct(productTest);
    expect(insertProduct).to.haveOwnProperty("_id");
  })

})

describe('Quando procura por todos os produtos cadastrados', ()=> {
  let mockConnection;

  beforeEach(async () => {
    mockConnection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(mockConnection);
    const insertProduct = await productsModel.createProduct(productTest);
  });

  afterEach(async () => {
    await mockConnection.db('StoreManager').collection('products').deleteMany({});
    MongoClient.connect.restore();
  });

  it('Retorna um array', async () => {
    const allProducts = await productsModel.getAll();
    expect(allProducts).to.be.an('array');
  })

  it('Que seja de objetos', async () => {
    const allProducts = await productsModel.getAll();
    expect(allProducts[0]).to.be.an('object');
  })

})

describe('Quando procura um produto por sua id', ()=> {
  let mockConnection;

  beforeEach(async () => {
    mockConnection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(mockConnection);
    // const insertProduct = await productsModel.createProduct(productTest);
  });

  afterEach(async () => {
    await mockConnection.db('StoreManager').collection('products').deleteMany({});
    MongoClient.connect.restore();
  });

  it('Se o id é inválido retorna null', async () => {
    const invalidId = "aaaaa"
    const insertProduct = await productsModel.createProduct(productTest);
    const result = await productsModel.getById(invalidId);

    expect(result).to.be.null;
  })

  describe('Retorna o produto se o id é válido', () => {
    it('o retorno é um objeto', async () => {
      const insertProduct = await productsModel.createProduct(productTest);
      const result = await productsModel.getById(insertProduct._id);

      expect(result).to.be.an('object');
    })
    it('Que possua a mesma id buscada', async ()=> {
      const insertProduct = await productsModel.createProduct(productTest);
      const result = await productsModel.getById(insertProduct._id);
  
      expect(insertProduct._id).to.be.eql(result._id);
    })
  
    it('E as chaves "name" e "quantity"', async ()=> {
      const insertProduct = await productsModel.createProduct(productTest);
      const result = await productsModel.getById(insertProduct._id);
  
      expect(insertProduct).to.haveOwnProperty("name");
      expect(insertProduct).to.haveOwnProperty("quantity");
    })
  })  
})

describe('Ao editar um produto retorna',()=>{
  let mockConnection;

  beforeEach(async () => {
    mockConnection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(mockConnection);
    // const insertProduct = await productsModel.createProduct(productTest);
  });

  afterEach(async () => {
    await mockConnection.db('StoreManager').collection('products').deleteMany({});
    MongoClient.connect.restore();
  });
  
  it('um objeto', async () => {
    const insertProduct = await productsModel.createProduct(productTest);
    const editedProduct = {_id: insertProduct._id, name: "Nome editado", quantity: 1000}
    const result = await productsModel.editProduct(editedProduct._id, editedProduct.name, editedProduct.quantity);

    expect(result).to.be.an.an('object');
  })

  it('Com a mesma id do produto editado', async () => {
    const insertProduct = await productsModel.createProduct(productTest);
    const editedProduct = {_id: insertProduct._id, name: "Nome editado", quantity: 1000}
    const result = await productsModel.editProduct(editedProduct._id, editedProduct.name, editedProduct.quantity);

    expect(result._id).to.be.eql(editedProduct._id);
  })

  it('Que possua as chaves "name" e "quantity"', async () => {
    const insertProduct = await productsModel.createProduct(productTest);
    const editedProduct = {_id: insertProduct._id, name: "Nome editado", quantity: 1000}
    const result = await productsModel.editProduct(editedProduct._id, editedProduct.name, editedProduct.quantity);

    expect(result).to.haveOwnProperty("name");
    expect(result).to.haveOwnProperty("quantity");
  })

  it('Que "name" e "quantity" tenham os mesmos valores enviados', async () => {
    const insertProduct = await productsModel.createProduct(productTest);
    const editedProduct = {_id: insertProduct._id, name: "Nome editado", quantity: 1000}
    const result = await productsModel.editProduct(editedProduct._id, editedProduct.name, editedProduct.quantity);

    expect(result.name).to.be.eql(editedProduct.name);
    expect(result.quantity).to.eql(editedProduct.quantity);
  })

})

describe('Ao apagar o produto', () => {
  let mockConnection;

  beforeEach(async () => {
    mockConnection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(mockConnection);
    // const insertProduct = await productsModel.createProduct(productTest);
  });

  afterEach(async () => {
    await mockConnection.db('StoreManager').collection('products').deleteMany({});
    MongoClient.connect.restore();
  });

  it('O produto nao pode mais ser encontrado', async ()=> {
    const insertProduct = await productsModel.createProduct(productTest);
    const deletedProduct = await productsModel.deleteProduct(insertProduct._id);
    const result = await productsModel.getById(insertProduct._id);

    expect(result).to.be.null;
  })
})

describe('Ao criar uma venda', () => {
  let mockConnection;

  beforeEach(async () => {
    mockConnection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(mockConnection);
    const insertProduct = await productsModel.createProduct(productTest);
  });

  afterEach(async () => {
    await mockConnection.db('StoreManager').collection('sales').deleteMany({});
    MongoClient.connect.restore();
  });
})