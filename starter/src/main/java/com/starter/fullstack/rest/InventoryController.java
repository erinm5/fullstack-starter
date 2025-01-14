package com.starter.fullstack.rest;

import com.starter.fullstack.api.Inventory;
import com.starter.fullstack.dao.InventoryDAO;
import java.util.List;
import java.util.Optional;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

/**
 * Inventory Controller.
 */
@RestController
@RequestMapping("/inventory")
public class InventoryController {
  private final InventoryDAO inventoryDAO;

  /**
   * Default Constructor.
   * @param inventoryDAO inventoryDAO.
   */
  public InventoryController(InventoryDAO inventoryDAO) {
    Assert.notNull(inventoryDAO, "Inventory DAO must not be null.");
    this.inventoryDAO = inventoryDAO;
  }

  /**
   * Find Products.
   * @return List of Product.
   */
  @GetMapping
  public List<Inventory> findInventories() {
    return this.inventoryDAO.findAll();
  }

  /**
   * Save Inventory.
   * @param inventory inventory.
   * @return Saved Inventory.
   */
  @PostMapping
  public Inventory createInventory(@RequestBody Inventory inventory) {
    return this.inventoryDAO.create(inventory);
  }

  /**
   * Delete Inventory.
   * @param ids ids.
   */
  @DeleteMapping
  public void deleteInventory(@RequestBody List<String> ids) {
    Assert.notEmpty(ids, "Inventory Ids were not provided");
    this.inventoryDAO.delete(ids);
  }

  /**
   * Find Inventory by ID
   * @param id ID of Inventory.
   * @return Retrieved Inventory.
   */
  @GetMapping("/{id}")
  public Optional<Inventory> retrieveInventoryById(@PathVariable @RequestBody String id) {
    Assert.notNull(id, "Inventory Id was not provided");
    return this.inventoryDAO.retrieve(id);
  }

  /**
   * Update Inventory by ID
   * @param id ID of inventory.
   * @param inventory Inventory.
   * @return Retrieved Inventory.
   */
  @PutMapping("/{id}")
  public Optional<Inventory> updateInventory(@RequestBody Inventory inventory , @RequestBody @PathVariable String id) {
    Assert.notNull(id, "Inventory Id was not provided");
    return this.inventoryDAO.update(id, inventory);
  }
}