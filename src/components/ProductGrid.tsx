import { DishCard } from "@/components/DishCard";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: { id: string; name: string; price: number; image: string }) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <section className="container-custom py-20">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 animate-slide-up">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-food-text-primary">
            Our Premium Products
          </h2>
          <p className="text-lg text-food-text-secondary max-w-2xl mx-auto text-balance">
            Carefully sourced premium products delivered with complete discretion
          </p>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-auto-fit gap-8 lg:gap-10">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <DishCard
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
                category={product.category}
                isPopular={product.isPopular}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}