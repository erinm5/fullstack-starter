package com.starter.fullstack.dao;
import com.starter.fullstack.api.Inventory;
import java.util.List;
import java.util.Optional;
import javax.annotation.PostConstruct;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.util.Assert;
import static org.springframework.data.mongodb.core.FindAndReplaceOptions.options;

/**
 * Inventory DAO
 */
public class InventoryDAO {
  private final MongoTemplate mongoTemplate;
  private static final String NAME = "name";
  private static final String PRODUCT_TYPE = "productType";

  /**
   * Default Constructor.
   * @param mongoTemplate MongoTemplate.
   */
  public InventoryDAO(MongoTemplate mongoTemplate) {
    Assert.notNull(mongoTemplate, "MongoTemplate must not be null.");
    this.mongoTemplate = mongoTemplate;
  }

  /**
   * Constructor to build indexes for rate blackout object
   */
  @PostConstruct
  public void setupIndexes() {
    IndexOperations indexOps = this.mongoTemplate.indexOps(Inventory.class);
    indexOps.ensureIndex(new Index(NAME, Sort.Direction.ASC));
    indexOps.ensureIndex(new Index(PRODUCT_TYPE, Sort.Direction.ASC));
  }

  /**
   * Find All Inventory.
   * @return List of found Inventory.
   */
  public List<Inventory> findAll() {
    return this.mongoTemplate.findAll(Inventory.class);
  }

  /**
   * Save Inventory.
   * @param inventory Inventory to Save/Update.
   * @return Created/Updated Inventory.
   */
  public Inventory create(Inventory inventory) {
    inventory.setId(null);
    return this.mongoTemplate.save(inventory, "inventory");
  }

  /**
   * Retrieve Inventory.
   * @param id Inventory id to Retrieve.
   * @return Found Inventory.
   */
  public Optional<Inventory> retrieve(String id) {
    Inventory inventory = this.mongoTemplate.findOne(Query.query(Criteria.where("_id").is(id)), 
      Inventory.class, "inventory");
    return Optional.ofNullable(inventory);
  }

  /**
   * Update Inventory.
   * @param id Inventory id to Update.
   * @param inventory Inventory to Update.
   * @return Updated Inventory.
   */
  public Optional<Inventory> update(String id, Inventory inventory) {
    Query query = new Query().addCriteria(Criteria.where("_id").is(id));
    Inventory updatedInventory = this.mongoTemplate.findAndReplace(query, inventory,
      options().returnNew(), "inventory");
    return Optional.ofNullable(updatedInventory);
  }

  /**
   * Delete Inventory By Ids.
   * @param ids Ids of Inventory.
   */
  public void delete(List<String> ids) {
    Query query = new Query().addCriteria(Criteria.where("_id").in(ids));
    this.mongoTemplate.remove(query, Inventory.class);
  }
}