import { useSearchParams, Link } from 'react-router-dom';
import { products } from '../mocks/data';
import ProductCard from '../components/ProductCard';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  
  const lowerCaseQuery = query.toLowerCase();
  
  const searchResults = products.filter(product => 
    product.title.toLowerCase().includes(lowerCaseQuery) || 
    product.category.toLowerCase().includes(lowerCaseQuery)
  );

  return (
    <div className="container" style={{ margin: '30px auto', minHeight: '60vh' }}>
      
      <div style={{ marginBottom: '30px' }}>
        <div style={{ fontSize: '14px', marginBottom: '10px', display: 'flex', gap: '8px' }}>
          <Link to="/" style={{ color: 'var(--azul-link)', textDecoration: 'none' }}>Início</Link>
          <span style={{ color: 'var(--cinza-texto)' }}>&gt;</span>
          <span style={{ color: 'var(--cinza-texto)' }}>Busca</span>
        </div>
        <h1 style={{ fontSize: '24px', color: 'var(--cinza-escuro)' }}>
          Resultados para "{query}"
        </h1>
        <p style={{ color: 'var(--cinza-texto)', marginTop: '5px' }}>
          {searchResults.length} {searchResults.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>
      </div>

      {searchResults.length > 0 ? (
        <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {searchResults.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--branco)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: 'var(--cinza-escuro)', marginBottom: '15px' }}>Não encontramos resultados para "{query}"</h2>
          <p style={{ color: 'var(--cinza-texto)', marginBottom: '20px' }}>
            Verifique se a palavra está escrita corretamente ou tente usar termos mais genéricos.
          </p>
          <Link to="/">
            <button className="btn-primary" style={{ width: 'auto' }}>Voltar para a página inicial</button>
          </Link>
        </div>
      )}

    </div>
  );
}

export default Search;