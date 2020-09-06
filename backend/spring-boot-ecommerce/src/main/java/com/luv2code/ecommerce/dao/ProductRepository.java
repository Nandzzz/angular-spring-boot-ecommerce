package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);

    Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable);

}











//@CrossOrigin("http://localhost:4200")
//@RepositoryRestResource(collectionResourceRel = "nanduProducts", path = "nandu-products")
//public interface ProductRepository extends JpaRepository<Product, Long> {
//	
//	Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);
//	
//	Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable);
//
//}




//{
//	  "_links" : {
//	    "nanduProducts" : {
//	      "href" : "http://localhost:8080/api/nandu-products{?page,size,sort}",
//	      "templated" : true
//	    },
//	    "productCategory" : {
//	      "href" : "http://localhost:8080/api/product-category{?page,size,sort}",
//	      "templated" : true
//	    },
//	    "profile" : {
//	      "href" : "http://localhost:8080/api/profile"
//	    }
//	  }
//	}
