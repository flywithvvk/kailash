# KAILASH AEGIS HU - Production Deployment Guide

##  Deployment Overview

**Platform**: Emergent Kubernetes  
**Domain**: kailash-ai.in  
**Database**: MongoD (kailash_aegis) - Emergent managed  
**Resources**:  replicas, m CPU, Gi RAM per pod  
**Company**: Go4Garage - URGAA EV Charging Network

---

## [OK] Pre-Deployment Checklist

### . Environment Variables (Set in Emergent Dashboard)

**Required**:
- `MONGO_URL` - Auto-injected by Emergent [OK]
- `D_NAME` - Set to `kailash_aegis`
- `SECRET_KEY` - Generate new 3+ character key
- `EMERGENT_LLM_KEY` - Auto-injected [OK]
- `ANTHROPIC_API_KEY` - or GANESHA Orchestrator

**Generate SECRET_KEY**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(3))"
```

### . Verify Code in Main ranch

```bash
git branch  # Should show * main
git log --oneline -  # Verify recent commits
git status  # Should be clean
```

### 3. Test Locally (Optional but Recommended)

```bash
cd /app/backend
source venv/bin/activate
uvicorn app.main:app --host ... --port 8
```

Visit: http://localhost:8/api/health

---

##  Deployment Process

### Step : Push to Emergent

Emergent handles:
- [OK] Docker container build
- [OK] Kubernetes deployment
- [OK] SSL certificate (kailash-ai.in)
- [OK] Load balancing ( replicas)
- [OK] Auto-scaling

### Step : Verify Deployment

```bash
# Health check
curl https://kailash-ai.in/api/health

# Expected response:
{
  "status": "healthy",
  "database": "connected",
  "version": "..",
  "domain": "kailash-ai.in",
  "departments": ,
  "sub_agents": 4
}
```

### Step 3: Test Authentication

```bash
curl -X POST https://kailash-ai.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "aegis_code": "<REDACTED_AEGIS_CODE>",
    "password": "<REDACTED_PASSWORD>"
  }'

# Should return JWT token
```

### Step 4: Test All  Departments

```bash
curl https://kailash-ai.in/api/departments/ \
  -H "Authorization: earer YOUR_TOKEN"

# Should return  departments
```

### Step : Test GANESHA Orchestrator

```bash
curl -X POST https://kailash-ai.in/api/ganesha/orchestrate \
  -H "Authorization: earer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user_message": "Hello GANESHA", "conversation_history": []}'

# Should stream SSE events
```

---

## [SECURE] Security Verification

### Test Rate Limiting

```bash
# Make  requests in  seconds (should get 49 on st)
for i in {..}; do
  curl https://kailash-ai.in/api/health
  sleep .9
done
```

### Test ailed Login Lockout

```bash
# Make  failed login attempts (should lock on th)
for i in {..}; do
  curl -X POST https://kailash-ai.in/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"aegis_code":"TEST","password":"wrong"}'
done
```

### Verify Security Headers

```bash
curl -I https://kailash-ai.in/api/health

# Should see:
# X-rame-Options: DENY
# X-Content-Type-Options: nosniff
# Strict-Transport-Security: max-age=33
# Server: KAILASH/.
```

---

##  Monitoring

### Health Checks

Kubernetes checks `/health` endpoint every  minutes

### Logs

```bash
# View application logs (via Emergent dashboard or kubectl)
kubectl logs -f deployment/kailash -n your-namespace

# View local logs
tail -f /app/logs/kailash_production.log
```

### Security Stats

```bash
curl https://kailash-ai.in/api/security/stats \
  -H "Authorization: earer YOUR_TOKEN"

# Returns:
{
  "active_rate_limits": ,
  "blocked_ips": ,
  "blocked_devices": ,
  "accounts_with_failed_attempts": ,
  "total_failed_attempts": 3
}
```

---

##  Troubleshooting

### Issue: 3 Service Unavailable

**Cause**: Database connection failed

**Solution**:
. Check MONGO_URL environment variable
. Verify MongoD is accessible
3. Check logs for connection errors

```bash
tail -f /app/logs/kailash_production.log | grep -i mongo
```

### Issue: 4 Unauthorized

**Cause**: Invalid or expired JWT token

**Solution**:
. Get new token via `/api/auth/login`
. Verify SECRET_KEY hasn't changed
3. Token expires after 4 hours

### Issue: 49 Too Many Requests

**Cause**: Rate limit exceeded

**Solution**:
. Wait  minute (limit resets)
. If persistent, IP may be temporarily blocked
3. Check if legitimate traffic pattern

### Issue: 43 Device locked

**Cause**:  failed login attempts

**Solution**:
. Wait  minutes for automatic unblock
. Verify correct AEGIS code and password
3. Contact admin if account compromise suspected

---

##  Support

**Admin Team**:
- Email: Connect@go4garage.in
- Technical: cto@go4garage.in
- Emergency: 89389

**API Documentation**: https://kailash-ai.in/api/docs

---

##  Success Criteria

Deployment is successful when:

[OK] Health endpoint returns   
[OK] All  departments accessible  
[OK] Authentication working  
[OK] GANESHA Orchestrator responding  
[OK] No errors in logs for  hour  
[OK] Response times < s  
[OK] Database connected  
[OK] SSL certificate valid  
[OK] Security headers present  
[OK] Rate limiting functional  
[OK] ailed login lockout working  

---

##  ackup & Recovery

### Manual ackup

```bash
cd /app/backend
python scripts/backup_mongodb.py
```

### Restore from ackup

```bash
mongorestore --uri="$MONGO_URL" --db=kailash_aegis /app/backups/kailash_backup_TIMESTAMP/kailash_aegis
```

### Automated ackups

ackups run daily via supervisor:
- Location: `/app/backups/`
- Retention: 3 days
- ormat: `kailash_backup_YYYYMMDD_HHMMSS`

---

**Deployment Version**: ..  
**Last Updated**: November 4  
**Platform**: Emergent Kubernetes  
**Company**: Go4Garage, Patna, India 🇮🇳  
**Domain**: kailash-ai.in
